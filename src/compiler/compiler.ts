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

import { ValueErrors, ValueError } from '../error/errors'
import { TypeGuard } from '../guard/index'
import * as Types from '../typebox'

// -------------------------------------------------------------------
// CheckFunction
// -------------------------------------------------------------------

export type CheckFunction = (value: unknown) => boolean

// -------------------------------------------------------------------
// TypeCheck
// -------------------------------------------------------------------

export class TypeCheck<T extends Types.TSchema> {
  constructor(private readonly schema: T, private readonly references: Types.TSchema[], private readonly checkFunc: CheckFunction, private readonly code: string) { }

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
// Property
// -------------------------------------------------------------------

export namespace Property {

  function DollarSign(code: number) {
    return code === 36
  }
  function Underscore(code: number) {
    return code === 95
  }
  function Numeric(code: number) {
    return code >= 48 && code <= 57
  }
  function Alpha(code: number) {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
  }

  function AssertEscapeCharacters(propertyName: string) {
    for (let i = 0; i < propertyName.length; i++) {
      const code = propertyName.charCodeAt(i)
      if ((code >= 7 && code <= 13) || code === 27 || code === 127) {
        throw Error('Property: Invalid escape character found in property key')
      }
    }
  }

  export function Check(propertyName: string) {
    AssertEscapeCharacters(propertyName)

    if (propertyName.length === 0) return false
    {
      const code = propertyName.charCodeAt(0)
      if (!(DollarSign(code) || Underscore(code) || Alpha(code))) {
        return false
      }
    }
    for (let i = 1; i < propertyName.length; i++) {
      const code = propertyName.charCodeAt(i)
      if (!(DollarSign(code) || Underscore(code) || Alpha(code) || Numeric(code))) {
        return false
      }
    }
    return true
  }
}

// -------------------------------------------------------------------
// TypeCompiler
// -------------------------------------------------------------------

export class TypeCompilerInvalidTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('TypeCompiler: Invalid type')
  }
}

/** Compiles Types for Runtime Type Checking */
export namespace TypeCompiler {
  // -------------------------------------------------------------------
  // Asserts
  // -------------------------------------------------------------------

  function AssertNumber(value: number): number {
    if (typeof value !== 'number') throw Error('TypeCompiler: Expected number')
    return value
  }

  function AssertPattern(value: string): string {
    try {
      new RegExp(value)
    } catch {
      throw Error('TypeCompiler: Expected pattern')
    }
    return value
  }

  // -------------------------------------------------------------------
  // Types
  // -------------------------------------------------------------------

  function* Any(schema: Types.TAny, value: string): Generator<string> {
    yield '(true)'
  }

  function* Array(schema: Types.TArray, value: string): Generator<string> {
    const expression = CreateExpression(schema.items, 'value')
    if (schema.minItems !== undefined) yield `(${value}.length >= ${AssertNumber(schema.minItems)})`
    if (schema.maxItems !== undefined) yield `(${value}.length <= ${AssertNumber(schema.maxItems)})`
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
    if (schema.multipleOf !== undefined) yield `(${value} % ${AssertNumber(schema.multipleOf)} === 0)`
    if (schema.exclusiveMinimum !== undefined) yield `(${value} > ${AssertNumber(schema.exclusiveMinimum)})`
    if (schema.exclusiveMaximum !== undefined) yield `(${value} < ${AssertNumber(schema.exclusiveMaximum)})`
    if (schema.minimum !== undefined) yield `(${value} >= ${AssertNumber(schema.minimum)})`
    if (schema.maximum !== undefined) yield `(${value} <= ${AssertNumber(schema.maximum)})`
  }

  function* Literal(schema: Types.TLiteral, value: string): Generator<string> {
    if (typeof schema.const === 'number' || typeof schema.const === 'boolean') {
      yield `(${value} === ${schema.const})`
    } else if (typeof schema.const === 'string') {
      yield `(${value} === '${schema.const}')`
    } else {
      throw Error('TypeCompiler: Literal value should be string, number or boolean')
    }
  }

  function* Null(schema: Types.TNull, value: string): Generator<string> {
    yield `(${value} === null)`
  }

  function* Number(schema: Types.TNumeric, value: string): Generator<string> {
    yield `(typeof ${value} === 'number')`
    if (schema.multipleOf !== undefined) yield `(${value} % ${AssertNumber(schema.multipleOf)} === 0)`
    if (schema.exclusiveMinimum !== undefined) yield `(${value} > ${AssertNumber(schema.exclusiveMinimum)})`
    if (schema.exclusiveMaximum !== undefined) yield `(${value} < ${AssertNumber(schema.exclusiveMaximum)})`
    if (schema.minimum !== undefined) yield `(${value} >= ${AssertNumber(schema.minimum)})`
    if (schema.maximum !== undefined) yield `(${value} <= ${AssertNumber(schema.maximum)})`
  }

  function* Object(schema: Types.TObject, value: string): Generator<string> {
    yield `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))`
    if (schema.minProperties !== undefined) yield `(Object.keys(${value}).length >= ${AssertNumber(schema.minProperties)})`
    if (schema.maxProperties !== undefined) yield `(Object.keys(${value}).length <= ${AssertNumber(schema.maxProperties)})`
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
      const memberExpression = Property.Check(propertyKey) ? `${value}.${propertyKey}` : `${value}['${propertyKey}']`
      const propertySchema = schema.properties[propertyKey]
      if (schema.required && schema.required.includes(propertyKey)) {
        yield* Visit(propertySchema, memberExpression)
      } else {
        const expression = CreateExpression(propertySchema, memberExpression)
        yield `(${memberExpression} === undefined ? true : (${expression}))`
      }
    }
  }

  function* Promise(schema: Types.TPromise<any>, value: string): Generator<string> {
    yield `(typeof value === 'object' && typeof ${value}.then === 'function')`
  }

  function* Record(schema: Types.TRecord<any, any>, value: string): Generator<string> {
    yield `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))`
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const local = PushLocal(`new RegExp(/${AssertPattern(keyPattern)}/)`)
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
      yield `(${value}.length >= ${AssertNumber(schema.minLength)})`
    }
    if (schema.maxLength !== undefined) {
      yield `(${value}.length <= ${AssertNumber(schema.maxLength)})`
    }
    if (schema.pattern !== undefined) {
      const local = PushLocal(`new RegExp(/${AssertPattern(schema.pattern)}/);`)
      yield `(${local}.test(${value}))`
    }
  }

  function* Tuple(schema: Types.TTuple<any[]>, value: string): Generator<string> {
    yield `(Array.isArray(${value}))`
    if (schema.items === undefined) return yield `(${value}.length === 0)`
    yield `(${value}.length === ${AssertNumber(schema.maxItems)})`
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
    if (schema.maxByteLength) yield `(${value}.length <= ${AssertNumber(schema.maxByteLength)})`
    if (schema.minByteLength) yield `(${value}.length >= ${AssertNumber(schema.minByteLength)})`
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
    if (TypeGuard.TAny(schema)) {
      return yield* Any(schema, value)
    } else if (TypeGuard.TArray(schema)) {
      return yield* Array(schema, value)
    } else if (TypeGuard.TBoolean(schema)) {
      return yield* Boolean(schema, value)
    } else if (TypeGuard.TConstructor(schema)) {
      return yield* Constructor(schema, value)
    } else if (TypeGuard.TFunction(schema)) {
      return yield* Function(schema, value)
    } else if (TypeGuard.TInteger(schema)) {
      return yield* Integer(schema, value)
    } else if (TypeGuard.TLiteral(schema)) {
      return yield* Literal(schema, value)
    } else if (TypeGuard.TNull(schema)) {
      return yield* Null(schema, value)
    } else if (TypeGuard.TNumber(schema)) {
      return yield* Number(schema, value)
    } else if (TypeGuard.TObject(schema)) {
      return yield* Object(schema, value)
    } else if (TypeGuard.TPromise(schema)) {
      return yield* Promise(schema, value)
    } else if (TypeGuard.TRecord(schema)) {
      return yield* Record(schema, value)
    } else if (TypeGuard.TRef(schema)) {
      return yield* Ref(schema, value)
    } else if (TypeGuard.TSelf(schema)) {
      return yield* Self(schema, value)
    } else if (TypeGuard.TString(schema)) {
      return yield* String(schema, value)
    } else if (TypeGuard.TTuple(schema)) {
      return yield* Tuple(schema, value)
    } else if (TypeGuard.TUndefined(schema)) {
      return yield* Undefined(schema, value)
    } else if (TypeGuard.TUnion(schema)) {
      return yield* Union(schema, value)
    } else if (TypeGuard.TUint8Array(schema)) {
      return yield* Uint8Array(schema, value)
    } else if (TypeGuard.TUnknown(schema)) {
      return yield* Unknown(schema, value)
    } else if (TypeGuard.TVoid(schema)) {
      return yield* Void(schema, value)
    } else {
      throw new TypeCompilerInvalidTypeError(schema)
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
