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

import * as Types from '../typebox'

// -----------------------------------------------------
// Compiler Function
// -----------------------------------------------------

export interface CheckOk {
  ok: true
}

export interface CheckFail {
  ok: false
  expr: string
  path: string
  kind: string
}

export type CheckFunction = (value: unknown) => CheckOk | CheckFail

export namespace TypeCompiler {
  // -------------------------------------------------------------------
  // Condition
  // -------------------------------------------------------------------

  export interface Condition {
    schema: Types.TSchema
    expr: string
    path: string
  }

  function CreateCondition<T extends Types.TSchema>(schema: T, path: string, expr: string): Condition {
    return { schema, path, expr }
  }

  // -------------------------------------------------------------------
  // Schemas
  // -------------------------------------------------------------------

  function* Any(schema: Types.TAny, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, '(true)')
  }

  function* Array(schema: Types.TArray, path: string): Generator<Condition> {
    const expr = [...Visit(schema.items, `value`)].map((condition) => condition.expr).join(' && ')
    yield CreateCondition(schema, path, `(Array.isArray(${path}) && ${path}.every(value => ${expr}))`)
  }

  function* Boolean(schema: Types.TBoolean, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof ${path} === 'boolean')`)
  }

  function* Constructor(schema: Types.TConstructor, path: string): Generator<Condition> {
    yield* Visit(schema.yields, path)
  }

  function* Function(schema: Types.TFunction, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof ${path} === 'function')`)
  }

  function* Integer(schema: Types.TNumeric, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof ${path} === 'number' && Number.isInteger(${path}))`)
    if (schema.multipleOf) yield CreateCondition(schema, path, `(${path} % ${schema.multipleOf} === 0)`)
    if (schema.exclusiveMinimum) yield CreateCondition(schema, path, `(${path} < ${schema.exclusiveMinimum})`)
    if (schema.exclusiveMaximum) yield CreateCondition(schema, path, `(${path} < ${schema.exclusiveMaximum})`)
    if (schema.minimum) yield CreateCondition(schema, path, `(${path} >= ${schema.minimum})`)
    if (schema.maximum) yield CreateCondition(schema, path, `(${path} <= ${schema.maximum})`)
  }

  function* Literal(schema: Types.TLiteral, path: string): Generator<Condition> {
    if (typeof schema.const === 'string') {
      yield CreateCondition(schema, path, `(${path} === '${schema.const}')`)
    } else {
      yield CreateCondition(schema, path, `(${path} === ${schema.const})`)
    }
  }

  function* Null(schema: Types.TNull, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(${path} === null)`)
  }

  function* Number(schema: Types.TNumeric, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof ${path} === 'number')`)
    if (schema.multipleOf) yield CreateCondition(schema, path, `(${path} % ${schema.multipleOf} === 0)`)
    if (schema.exclusiveMinimum) yield CreateCondition(schema, path, `(${path} < ${schema.exclusiveMinimum})`)
    if (schema.exclusiveMaximum) yield CreateCondition(schema, path, `(${path} < ${schema.exclusiveMaximum})`)
    if (schema.minimum) yield CreateCondition(schema, path, `(${path} >= ${schema.minimum})`)
    if (schema.maximum) yield CreateCondition(schema, path, `(${path} <= ${schema.maximum})`)
  }

  function* Object(schema: Types.TObject, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof ${path} === 'object' && ${path} !== null && !Array.isArray(${path}))`)
    if (schema.minProperties !== undefined) yield CreateCondition(schema, path, `(Object.keys(${path}).length >= ${schema.minProperties})`)
    if (schema.maxProperties !== undefined) yield CreateCondition(schema, path, `(Object.keys(${path}).length <= ${schema.maxProperties})`)
    const propertyKeys = globalThis.Object.keys(schema.properties)
    if (schema.additionalProperties === false) {
      // optimization: If the property key length matches the required keys length
      // then we only need check that the values property key length matches that
      // of the property key length. This is because exhaustive testing for values
      // will occur in subsequent property tests.
      if (schema.required && schema.required.length === propertyKeys.length) {
        yield CreateCondition(schema, path, `(Object.keys(${path}).length === ${propertyKeys.length})`)
      } else {
        const keys = `[${propertyKeys.map((key) => `'${key}'`).join(', ')}]`
        yield CreateCondition(schema, path, `(Object.keys(${path}).every(key => ${keys}.includes(key)))`)
      }
    }
    for (const propertyKey of propertyKeys) {
      const propertySchema = schema.properties[propertyKey]
      if (schema.required && schema.required.includes(propertyKey)) {
        yield* Visit(propertySchema, `${path}.${propertyKey}`)
      } else {
        const expr = [...Visit(propertySchema, `${path}.${propertyKey}`)].map((condition) => condition.expr).join(' && ')
        yield CreateCondition(schema, `${path}.${propertyKey}`, `(${path}.${propertyKey} === undefined ? true : (${expr}))`)
      }
    }
  }

  function* Promise(schema: Types.TPromise<any>, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof value === 'object' && typeof ${path}.then === 'function')`)
  }

  function* Record(schema: Types.TRecord<any, any>, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof ${path} === 'object' && ${path} !== null && !Array.isArray(${path}))`)
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const local = PushLocal(`const local = new RegExp(/${keyPattern}/)`)
    yield CreateCondition(schema, path, `(Object.keys(${path}).every(key => ${local}.test(key)))`)
    const expr = [...Visit(valueSchema, 'value')].map((cond) => cond.expr).join(' && ')
    yield CreateCondition(schema, path, `(Object.values(${path}).every(value => ${expr}))`)
  }

  function* Ref(schema: Types.TRef<any>, path: string): Generator<Condition> {
    // reference: referenced schemas can originate from either additional
    // schemas or inline in the schema itself. Ideally the recursive
    // path should align to reference path. Consider for review.
    if (!functionNames.has(schema.$ref)) {
      const reference = referenceMap.get(schema.$ref)!
      functionNames.add(schema.$ref)
      const conditions = [...Visit(reference, 'value')]
      const name = CreateFunctionName(schema.$ref)
      const body = CreateFunction(name, conditions)
      PushLocal(body)
    }
    const func = CreateFunctionName(schema.$ref)
    yield CreateCondition(schema, path, `(${func}(${path}).ok)`)
  }

  function* Self(schema: Types.TSelf, path: string): Generator<Condition> {
    const func = CreateFunctionName(schema.$ref)
    yield CreateCondition(schema, path, `(${func}(${path}).ok)`)
  }

  function* String(schema: Types.TString, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(typeof ${path} === 'string')`)
    if (schema.pattern !== undefined) {
      const local = PushLocal(`const local = new RegExp('${schema.pattern}');`)
      yield CreateCondition(schema, path, `(${local}.test(${path}))`)
    }
  }

  function* Tuple(schema: Types.TTuple<any[]>, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(Array.isArray(${path}))`)
    if (schema.items === undefined) return yield CreateCondition(schema, path, `(${path}.length === 0)`)
    yield CreateCondition(schema, path, `(${path}.length === ${schema.maxItems})`)
    for (let i = 0; i < schema.items.length; i++) {
      const expr = [...Visit(schema.items[i], `${path}[${i}]`)].map((condition) => condition.expr).join(' && ')
      yield CreateCondition(schema, path, `(${expr})`)
    }
  }

  function* Undefined(schema: Types.TUndefined, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `${path} === undefined`)
  }

  function* Union(schema: Types.TUnion<any[]>, path: string): Generator<Condition> {
    const exprs = schema.anyOf.map((schema: Types.TSchema) => [...Visit(schema, path)].map((cond) => cond.expr).join(' && '))
    yield CreateCondition(schema, path, `(${exprs.join(' || ')})`)
  }

  function* Uint8Array(schema: Types.TUint8Array, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(${path} instanceof Uint8Array)`)
    if (schema.maxByteLength) yield CreateCondition(schema, path, `(${path}.length <= ${schema.maxByteLength})`)
    if (schema.minByteLength) yield CreateCondition(schema, path, `(${path}.length >= ${schema.minByteLength})`)
  }

  function* Unknown(schema: Types.TUnknown, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, '(true)')
  }

  function* Void(schema: Types.TVoid, path: string): Generator<Condition> {
    yield CreateCondition(schema, path, `(${path} === null)`)
  }

  function* Visit<T extends Types.TSchema>(schema: T, path: string): Generator<Condition> {
    // reference: referenced schemas can originate from either additional
    // schemas or inline in the schema itself. Ideally the recursive
    // path should align to reference path. Consider for review.
    if (schema.$id && !functionNames.has(schema.$id)) {
      functionNames.add(schema.$id)
      const conditions = [...Visit(schema, 'value')]
      const name = CreateFunctionName(schema.$id)
      const body = CreateFunction(name, conditions)
      PushLocal(body)
      yield CreateCondition(schema, path, `(${name}(${path}).ok)`)
      return
    }

    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return yield* Any(anySchema, path)
      case 'Array':
        return yield* Array(anySchema, path)
      case 'Boolean':
        return yield* Boolean(anySchema, path)
      case 'Constructor':
        return yield* Constructor(anySchema, path)
      case 'Function':
        return yield* Function(anySchema, path)
      case 'Integer':
        return yield* Integer(anySchema, path)
      case 'Literal':
        return yield* Literal(anySchema, path)
      case 'Null':
        return yield* Null(anySchema, path)
      case 'Number':
        return yield* Number(anySchema, path)
      case 'Object':
        return yield* Object(anySchema, path)
      case 'Promise':
        return yield* Promise(anySchema, path)
      case 'Record':
        return yield* Record(anySchema, path)
      case 'Ref':
        return yield* Ref(anySchema, path)
      case 'Self':
        return yield* Self(anySchema, path)
      case 'String':
        return yield* String(anySchema, path)
      case 'Tuple':
        return yield* Tuple(anySchema, path)
      case 'Undefined':
        return yield* Undefined(anySchema, path)
      case 'Union':
        return yield* Union(anySchema, path)
      case 'Uint8Array':
        return yield* Uint8Array(anySchema, path)
      case 'Unknown':
        return yield* Unknown(anySchema, path)
      case 'Void':
        return yield* Void(anySchema, path)
      default:
        throw Error(`Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }

  // -------------------------------------------------------------------
  // Locals
  // -------------------------------------------------------------------
  const referenceMap = new Map<string, Types.TSchema>()
  const functionLocals = new Set<string>()
  const functionNames = new Set<string>()

  function ClearLocals() {
    functionLocals.clear()
    functionNames.clear()
    referenceMap.clear()
  }

  function PushReferences(schemas: Types.TSchema[] = []) {
    for (const schema of schemas) {
      if (!schema.$id) throw Error(`Referenced schemas must specify an $id. Failed for '${JSON.stringify(schema)}'`)
      if (referenceMap.has(schema.$id)) throw Error(`Duplicate schema $id detected for '${schema.$id}'`)
      referenceMap.set(schema.$id, schema)
    }
  }

  function PushLocal(code: string) {
    const name = `local${functionLocals.size}`
    functionLocals.add(code.replace('local', name))
    return name
  }

  function GetLocals() {
    return [...functionLocals.values()]
  }

  // -------------------------------------------------------------------
  // Functions
  // -------------------------------------------------------------------

  function CreateFunctionName($id: string) {
    return `check_${$id.replace(/-/g, '_')}`
  }

  function CreateFunction(name: string, conditions: Condition[]) {
    const statements = conditions.map((condition, index) => `  if(!${condition.expr}) { return { ok: false, path: '${condition.path}', data: ${condition.path} } }`)
    return `function ${name}(value) {\n${statements.join('\n')}\n  return { ok: true }\n}`
  }

  // -------------------------------------------------------------------
  // Compiler
  // -------------------------------------------------------------------

  /** Returns the validation kernel as a string. This function is primarily used for debugging. */
  export function Kernel<T extends Types.TSchema>(schema: T, additional: Types.TSchema[] = []): string {
    ClearLocals()
    PushReferences(additional)
    const conditions = [...Visit(schema, 'value')] // locals populated during yield
    const locals = GetLocals()
    return `${locals.join('\n')}\nreturn ${CreateFunction('check', conditions)}`
  }

  /** Compiles a type into validation function */
  export function Compile<T extends Types.TSchema>(schema: T, additional: Types.TSchema[] = []): CheckFunction {
    const kernel = Kernel(schema, additional)
    const func = globalThis.Function(kernel)
    return func()
  }
}
