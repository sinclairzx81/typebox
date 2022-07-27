/*--------------------------------------------------------------------------

@sinclair/typebox/compiler

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { ValueErrors, ValueError } from '../value/errors'
import * as Types from '../typebox'

// -------------------------------------------------------------------
// CheckFunction
// -------------------------------------------------------------------

export type CheckFunction = (value: unknown) => boolean

// -------------------------------------------------------------------
// TypeCheck
// -------------------------------------------------------------------

export class TypeCheck<T extends Types.TSchema> {
  constructor(private readonly schema: T, private readonly references: Types.TSchema[], private readonly checkFunc: CheckFunction, private readonly code: string) {}

  /** Returns the generated validation code used to validate this type. */
  public Code(): string {
    return this.code
  }

  /** Returns an iterator for each error in this value. */
  public Errors(value: unknown): IterableIterator<ValueError> {
    return ValueErrors.Errors(this.schema, this.references, value)
  }

  /** Returns true if the value matches the given type. */
  public Check(value: unknown): value is Types.Static<T> {
    return this.checkFunc(value)
  }
}

// -------------------------------------------------------------------
// TypeCompiler
// -------------------------------------------------------------------

/** Compiles Types for Runtime Type Checking */
export namespace TypeCompiler {
  // -------------------------------------------------------------------
  // Types
  // -------------------------------------------------------------------

  function* Any(schema: Types.TAny, value: string): Generator<string> {
    yield '(true)'
  }

  function* Array(schema: Types.TArray, value: string): Generator<string> {
    const expression = CreateExpression(schema.items, 'value')
    if (schema.minItems !== undefined) yield `(${value}.length >= ${schema.minItems})`
    if (schema.maxItems !== undefined) yield `(${value}.length <= ${schema.maxItems})`
    if (schema.uniqueItems !== undefined) yield `(new Set(${value}).size === ${value}.length)`
    yield `(Array.isArray(${value}) && ${value}.every(value => ${expression}))`
  }

  function* Boolean(schema: Types.TBoolean, value: string): Generator<string> {
    yield `(typeof ${value} === 'boolean')`
  }

  function* Constructor(schema: Types.TConstructor, value: string): Generator<string> {
    yield* Visit(schema.returns, value)
  }

  function* Function(schema: Types.TFunction, value: string): Generator<string> {
    yield `(typeof ${value} === 'function')`
  }

  function* Integer(schema: Types.TNumeric, value: string): Generator<string> {
    yield `(typeof ${value} === 'number' && Number.isInteger(${value}))`
    if (schema.multipleOf !== undefined) yield `(${value} % ${schema.multipleOf} === 0)`
    if (schema.exclusiveMinimum !== undefined) yield `(${value} > ${schema.exclusiveMinimum})`
    if (schema.exclusiveMaximum !== undefined) yield `(${value} < ${schema.exclusiveMaximum})`
    if (schema.minimum !== undefined) yield `(${value} >= ${schema.minimum})`
    if (schema.maximum !== undefined) yield `(${value} <= ${schema.maximum})`
  }

  function* Literal(schema: Types.TLiteral, value: string): Generator<string> {
    if (typeof schema.const === 'string') {
      yield `(${value} === '${schema.const}')`
    } else {
      yield `(${value} === ${schema.const})`
    }
  }

  function* Null(schema: Types.TNull, value: string): Generator<string> {
    yield `(${value} === null)`
  }

  function* Number(schema: Types.TNumeric, value: string): Generator<string> {
    yield `(typeof ${value} === 'number')`
    if (schema.multipleOf !== undefined) yield `(${value} % ${schema.multipleOf} === 0)`
    if (schema.exclusiveMinimum !== undefined) yield `(${value} > ${schema.exclusiveMinimum})`
    if (schema.exclusiveMaximum !== undefined) yield `(${value} < ${schema.exclusiveMaximum})`
    if (schema.minimum !== undefined) yield `(${value} >= ${schema.minimum})`
    if (schema.maximum !== undefined) yield `(${value} <= ${schema.maximum})`
  }

  function* Object(schema: Types.TObject, value: string): Generator<string> {
    yield `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))`
    if (schema.minProperties !== undefined) yield `(Object.keys(${value}).length >= ${schema.minProperties})`
    if (schema.maxProperties !== undefined) yield `(Object.keys(${value}).length <= ${schema.maxProperties})`
    const propertyKeys = globalThis.Object.keys(schema.properties)
    if (schema.additionalProperties === false) {
      // optimization: If the property key length matches the required keys length
      // then we only need check that the values property key length matches that
      // of the property key length. This is because exhaustive testing for values
      // will occur in subsequent property tests.
      if (schema.required && schema.required.length === propertyKeys.length) {
        yield `(Object.keys(${value}).length === ${propertyKeys.length})`
      } else {
        const keys = `[${propertyKeys.map((key) => `'${key}'`).join(', ')}]`
        yield `(Object.keys(${value}).every(key => ${keys}.includes(key)))`
      }
    }
    for (const propertyKey of propertyKeys) {
      const propertySchema = schema.properties[propertyKey]
      if (schema.required && schema.required.includes(propertyKey)) {
        yield* Visit(propertySchema, `${value}.${propertyKey}`)
      } else {
        const expression = CreateExpression(propertySchema, `${value}.${propertyKey}`)
        yield `(${value}.${propertyKey} === undefined ? true : (${expression}))`
      }
    }
  }

  function* Promise(schema: Types.TPromise<any>, value: string): Generator<string> {
    yield `(typeof value === 'object' && typeof ${value}.then === 'function')`
  }

  function* Record(schema: Types.TRecord<any, any>, value: string): Generator<string> {
    yield `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))`
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const local = PushLocal(`new RegExp(/${keyPattern}/)`)
    yield `(Object.keys(${value}).every(key => ${local}.test(key)))`
    const expression = CreateExpression(valueSchema, 'value')
    yield `(Object.values(${value}).every(value => ${expression}))`
  }

  function* Ref(schema: Types.TRef<any>, value: string): Generator<string> {
    if (!referenceMap.has(schema.$ref)) throw Error(`TypeCompiler.Ref: Cannot de-reference schema with $id '${schema.$ref}'`)
    const reference = referenceMap.get(schema.$ref)!
    yield* Visit(reference, value)
  }

  function* Self(schema: Types.TSelf, value: string): Generator<string> {
    const func = CreateFunctionName(schema.$ref)
    yield `(${func}(${value}))`
  }

  function* String(schema: Types.TString, value: string): Generator<string> {
    yield `(typeof ${value} === 'string')`
    if (schema.minLength !== undefined) {
      yield `(${value}.length >= ${schema.minLength})`
    }
    if (schema.maxLength !== undefined) {
      yield `(${value}.length <= ${schema.maxLength})`
    }
    if (schema.pattern !== undefined) {
      const local = PushLocal(`new RegExp(/${schema.pattern}/);`)
      yield `(${local}.test(${value}))`
    }
  }

  function* Tuple(schema: Types.TTuple<any[]>, value: string): Generator<string> {
    yield `(Array.isArray(${value}))`
    if (schema.items === undefined) return yield `(${value}.length === 0)`
    yield `(${value}.length === ${schema.maxItems})`
    for (let i = 0; i < schema.items.length; i++) {
      const expression = CreateExpression(schema.items[i], `${value}[${i}]`)
      yield `(${expression})`
    }
  }

  function* Undefined(schema: Types.TUndefined, value: string): Generator<string> {
    yield `(${value} === undefined)`
  }

  function* Union(schema: Types.TUnion<any[]>, value: string): Generator<string> {
    const expressions = schema.anyOf.map((schema: Types.TSchema) => CreateExpression(schema, value))
    yield `(${expressions.join(' || ')})`
  }

  function* Uint8Array(schema: Types.TUint8Array, value: string): Generator<string> {
    yield `(${value} instanceof Uint8Array)`
    if (schema.maxByteLength) yield `(${value}.length <= ${schema.maxByteLength})`
    if (schema.minByteLength) yield `(${value}.length >= ${schema.minByteLength})`
  }

  function* Unknown(schema: Types.TUnknown, value: string): Generator<string> {
    yield '(true)'
  }

  function* Void(schema: Types.TVoid, value: string): Generator<string> {
    yield `(${value} === null)`
  }

  function* Visit<T extends Types.TSchema>(schema: T, value: string): Generator<string> {
    // reference: referenced schemas can originate from either additional
    // schemas or inline in the schema itself. Ideally the recursive
    // path should align to reference path. Consider for review.
    if (schema.$id && !names.has(schema.$id)) {
      names.add(schema.$id)
      const name = CreateFunctionName(schema.$id)
      const body = CreateFunction(name, schema, 'value')
      PushFunction(body)
      yield `(${name}(${value}))`
      return
    }

    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return yield* Any(anySchema, value)
      case 'Array':
        return yield* Array(anySchema, value)
      case 'Boolean':
        return yield* Boolean(anySchema, value)
      case 'Constructor':
        return yield* Constructor(anySchema, value)
      case 'Function':
        return yield* Function(anySchema, value)
      case 'Integer':
        return yield* Integer(anySchema, value)
      case 'Literal':
        return yield* Literal(anySchema, value)
      case 'Null':
        return yield* Null(anySchema, value)
      case 'Number':
        return yield* Number(anySchema, value)
      case 'Object':
        return yield* Object(anySchema, value)
      case 'Promise':
        return yield* Promise(anySchema, value)
      case 'Record':
        return yield* Record(anySchema, value)
      case 'Ref':
        return yield* Ref(anySchema, value)
      case 'Self':
        return yield* Self(anySchema, value)
      case 'String':
        return yield* String(anySchema, value)
      case 'Tuple':
        return yield* Tuple(anySchema, value)
      case 'Undefined':
        return yield* Undefined(anySchema, value)
      case 'Union':
        return yield* Union(anySchema, value)
      case 'Uint8Array':
        return yield* Uint8Array(anySchema, value)
      case 'Unknown':
        return yield* Unknown(anySchema, value)
      case 'Void':
        return yield* Void(anySchema, value)
      default:
        throw new Error(`TypeCompiler: Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }

  // -------------------------------------------------------------------
  // Compile State
  // -------------------------------------------------------------------

  const referenceMap = new Map<string, Types.TSchema>()
  const locals = new Set<string>() // local variables and functions
  const names = new Set<string>() // cache of local functions

  function ResetCompiler() {
    referenceMap.clear()
    locals.clear()
    names.clear()
  }

  function AddReferences(schemas: Types.TSchema[] = []) {
    for (const schema of schemas) {
      if (!schema.$id) throw new Error(`TypeCompiler: Referenced schemas must specify an $id.`)
      if (referenceMap.has(schema.$id)) throw new Error(`TypeCompiler: Duplicate schema $id found for '${schema.$id}'`)
      referenceMap.set(schema.$id, schema)
    }
  }

  function CreateExpression(schema: Types.TSchema, value: string): string {
    return [...Visit(schema, value)].join(' && ')
  }

  function CreateFunctionName($id: string) {
    return `check_${$id.replace(/-/g, '_')}`
  }

  function CreateFunction(name: string, schema: Types.TSchema, value: string): string {
    const expression = [...Visit(schema, value)].map((condition) => `    ${condition}`).join(' &&\n')
    return `function ${name}(value) {\n  return (\n${expression}\n )\n}`
  }

  function PushFunction(functionBody: string) {
    locals.add(functionBody)
  }

  function PushLocal(expression: string) {
    const local = `local_${locals.size}`
    locals.add(`const ${local} = ${expression}`)
    return local
  }

  function GetLocals() {
    return [...locals.values()]
  }

  // -------------------------------------------------------------------
  // Compile
  // -------------------------------------------------------------------

  function Build<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = []): string {
    ResetCompiler()
    AddReferences(references)
    const check = CreateFunction('check', schema, 'value')
    const locals = GetLocals()
    return `${locals.join('\n')}\nreturn ${check}`
  }

  /** Compiles the given type for runtime type checking. This compiler only accepts known TypeBox types non-inclusive of unsafe types. */
  export function Compile<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = []): TypeCheck<T> {
    const code = Build(schema, references)
    const func = globalThis.Function(code)
    return new TypeCheck(schema, references, func(), code)
  }
}
