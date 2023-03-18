/*--------------------------------------------------------------------------

@sinclair/typebox/compiler

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import { ValueErrors, ValueErrorIterator } from '../errors/index'
import { TypeSystem } from '../system/index'
import { ValueHash } from '../value/hash'

// -------------------------------------------------------------------
// CheckFunction
// -------------------------------------------------------------------
export type CheckFunction = (value: unknown) => boolean
// -------------------------------------------------------------------
// TypeCheck
// -------------------------------------------------------------------
export class TypeCheck<T extends Types.TSchema> {
  constructor(private readonly schema: T, private readonly checkFunc: CheckFunction, private readonly code: string) {}
  /** Returns the generated assertion code used to validate this type. */
  public Code(): string {
    return this.code
  }
  /** Returns an iterator for each error in this value. */
  public Errors(value: unknown): ValueErrorIterator {
    return ValueErrors.Errors(this.schema, value)
  }
  /** Returns true if the value matches the compiled type. */
  public Check(value: unknown): value is Types.Static<T> {
    return this.checkFunc(value)
  }
}
// -------------------------------------------------------------------
// Character
// -------------------------------------------------------------------
namespace Character {
  export function DollarSign(code: number) {
    return code === 36
  }
  export function Underscore(code: number) {
    return code === 95
  }
  export function Numeric(code: number) {
    return code >= 48 && code <= 57
  }
  export function Alpha(code: number) {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
  }
}
// -------------------------------------------------------------------
// Identifier
// -------------------------------------------------------------------
namespace Identifier {
  export function Encode($id: string) {
    const buffer: string[] = []
    for (let i = 0; i < $id.length; i++) {
      const code = $id.charCodeAt(i)
      if (Character.Numeric(code) || Character.Alpha(code)) {
        buffer.push($id.charAt(i))
      } else {
        buffer.push(`_${code}_`)
      }
    }
    return buffer.join('').replace(/__/g, '_')
  }
}
// -------------------------------------------------------------------
// MemberExpression
// -------------------------------------------------------------------
export namespace MemberExpression {
  function Check(propertyName: string) {
    if (propertyName.length === 0) return false
    {
      const code = propertyName.charCodeAt(0)
      if (!(Character.DollarSign(code) || Character.Underscore(code) || Character.Alpha(code))) {
        return false
      }
    }
    for (let i = 1; i < propertyName.length; i++) {
      const code = propertyName.charCodeAt(i)
      if (!(Character.DollarSign(code) || Character.Underscore(code) || Character.Alpha(code) || Character.Numeric(code))) {
        return false
      }
    }
    return true
  }
  export function Encode(object: string, key: string) {
    return !Check(key) ? `${object}['${key}']` : `${object}.${key}`
  }
}
// -------------------------------------------------------------------
// TypeCompiler
// -------------------------------------------------------------------
export class TypeCompilerUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('TypeCompiler: Unknown type')
  }
}
export class TypeCompilerPreflightCheckError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('TypeCompiler: Preflight validation check failed for given schema')
  }
}
/** Compiles Types for Runtime Type Checking */
export namespace TypeCompiler {
  // -------------------------------------------------------------------
  // Guards
  // -------------------------------------------------------------------
  function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  function IsNumber(value: unknown): value is number {
    return typeof value === 'number' && globalThis.Number.isFinite(value)
  }
  // -------------------------------------------------------------------
  // Types
  // -------------------------------------------------------------------
  function* Any(schema: Types.TAny, value: string): IterableIterator<string> {
    yield 'true'
  }
  function* Array(schema: Types.TArray, value: string): IterableIterator<string> {
    const expression = CreateExpression(schema.items, 'value')
    yield `Array.isArray(${value}) && ${value}.every(value => ${expression})`
    if (IsNumber(schema.minItems)) yield `${value}.length >= ${schema.minItems}`
    if (IsNumber(schema.maxItems)) yield `${value}.length <= ${schema.maxItems}`
    if (schema.uniqueItems === true) yield `((function() { const set = new Set(); for(const element of ${value}) { const hashed = hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true })())`
  }
  function* BigInt(schema: Types.TBigInt, value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'bigint')`
    if (IsBigInt(schema.multipleOf)) yield `(${value} % BigInt(${schema.multipleOf})) === 0`
    if (IsBigInt(schema.exclusiveMinimum)) yield `${value} > BigInt(${schema.exclusiveMinimum})`
    if (IsBigInt(schema.exclusiveMaximum)) yield `${value} < BigInt(${schema.exclusiveMaximum})`
    if (IsBigInt(schema.minimum)) yield `${value} >= BigInt(${schema.minimum})`
    if (IsBigInt(schema.maximum)) yield `${value} <= BigInt(${schema.maximum})`
  }
  function* Boolean(schema: Types.TBoolean, value: string): IterableIterator<string> {
    yield `typeof ${value} === 'boolean'`
  }
  function* Constructor(schema: Types.TConstructor, value: string): IterableIterator<string> {
    yield* Visit(schema.returns, `${value}.prototype`)
  }
  function* Date(schema: Types.TDate, value: string): IterableIterator<string> {
    yield `(${value} instanceof Date) && Number.isFinite(${value}.getTime())`
    if (IsNumber(schema.exclusiveMinimumTimestamp)) yield `${value}.getTime() > ${schema.exclusiveMinimumTimestamp}`
    if (IsNumber(schema.exclusiveMaximumTimestamp)) yield `${value}.getTime() < ${schema.exclusiveMaximumTimestamp}`
    if (IsNumber(schema.minimumTimestamp)) yield `${value}.getTime() >= ${schema.minimumTimestamp}`
    if (IsNumber(schema.maximumTimestamp)) yield `${value}.getTime() <= ${schema.maximumTimestamp}`
  }
  function* Function(schema: Types.TFunction, value: string): IterableIterator<string> {
    yield `typeof ${value} === 'function'`
  }
  function* Integer(schema: Types.TInteger, value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'number' && Number.isInteger(${value}))`
    if (IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
    if (IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
  }
  function* Intersect(schema: Types.TIntersect, value: string): IterableIterator<string> {
    if (schema.unevaluatedProperties === undefined) {
      const expressions = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, value))
      yield `${expressions.join(' && ')}`
    } else if (schema.unevaluatedProperties === false) {
      // prettier-ignore
      const schemaKeys = Types.KeyResolver.Resolve(schema).map((key) => `'${key}'`).join(', ')
      const expressions = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, value))
      const expression1 = `Object.getOwnPropertyNames(${value}).every(key => [${schemaKeys}].includes(key))`
      yield `${expressions.join(' && ')} && ${expression1}`
    } else if (typeof schema.unevaluatedProperties === 'object') {
      // prettier-ignore
      const schemaKeys = Types.KeyResolver.Resolve(schema).map((key) => `'${key}'`).join(', ')
      const expressions = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, value))
      const expression1 = CreateExpression(schema.unevaluatedProperties, 'value[key]')
      const expression2 = `Object.getOwnPropertyNames(${value}).every(key => [${schemaKeys}].includes(key) || ${expression1})`
      yield `${expressions.join(' && ')} && ${expression2}`
    }
  }
  function* Literal(schema: Types.TLiteral, value: string): IterableIterator<string> {
    if (typeof schema.const === 'number' || typeof schema.const === 'boolean') {
      yield `${value} === ${schema.const}`
    } else {
      yield `${value} === '${schema.const}'`
    }
  }
  function* Never(schema: Types.TNever, value: string): IterableIterator<string> {
    yield `false`
  }
  function* Not(schema: Types.TNot, value: string): IterableIterator<string> {
    const left = CreateExpression(schema.allOf[0].not, value)
    const right = CreateExpression(schema.allOf[1], value)
    yield `!${left} && ${right}`
  }
  function* Null(schema: Types.TNull, value: string): IterableIterator<string> {
    yield `${value} === null`
  }
  function* Number(schema: Types.TNumber, value: string): IterableIterator<string> {
    yield `typeof ${value} === 'number'`
    if (!TypeSystem.AllowNaN) yield `Number.isFinite(${value})`
    if (IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
    if (IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
  }
  function* Object(schema: Types.TObject, value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'object' && ${value} !== null)`
    if (!TypeSystem.AllowArrayObjects) yield `!Array.isArray(${value})`
    if (IsNumber(schema.minProperties)) yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`
    if (IsNumber(schema.maxProperties)) yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`
    const schemaKeys = globalThis.Object.getOwnPropertyNames(schema.properties)
    for (const schemaKey of schemaKeys) {
      const memberExpression = MemberExpression.Encode(value, schemaKey)
      const property = schema.properties[schemaKey]
      if (schema.required && schema.required.includes(schemaKey)) {
        yield* Visit(property, memberExpression)
        if (Types.ExtendsUndefined.Check(property)) yield `('${schemaKey}' in ${value})`
      } else {
        const expression = CreateExpression(property, memberExpression)
        yield `('${schemaKey}' in ${value} ? ${expression} : true)`
      }
    }
    if (schema.additionalProperties === false) {
      if (schema.required && schema.required.length === schemaKeys.length) {
        yield `Object.getOwnPropertyNames(${value}).length === ${schemaKeys.length}`
      } else {
        const keys = `[${schemaKeys.map((key) => `'${key}'`).join(', ')}]`
        yield `Object.getOwnPropertyNames(${value}).every(key => ${keys}.includes(key))`
      }
    }
    if (typeof schema.additionalProperties === 'object') {
      const expression = CreateExpression(schema.additionalProperties, 'value[key]')
      const keys = `[${schemaKeys.map((key) => `'${key}'`).join(', ')}]`
      yield `(Object.getOwnPropertyNames(${value}).every(key => ${keys}.includes(key) || ${expression}))`
    }
  }
  function* Promise(schema: Types.TPromise<any>, value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && typeof ${value}.then === 'function')`
  }
  function* Record(schema: Types.TRecord<any, any>, value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'object' && ${value} !== null && !(${value} instanceof Date))`
    if (!TypeSystem.AllowArrayObjects) yield `!Array.isArray(${value})`
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const local = PushLocal(`new RegExp(/${keyPattern}/)`)
    yield `(Object.getOwnPropertyNames(${value}).every(key => ${local}.test(key)))`
    const expression = CreateExpression(valueSchema, 'value')
    yield `Object.values(${value}).every(value => ${expression})`
  }
  function* Ref(schema: Types.TRef<any>, value: string): IterableIterator<string> {
    // Reference: If we have seen this reference before we can just yield and return
    // the function call. If this isn't the case we defer to visit to generate and
    // set the function for subsequent passes. Consider for refactor.
    if (state_local_function_names.has(schema.$ref)) return yield `${CreateFunctionName(schema.$ref)}(${value})`
    yield* Visit(Types.ReferenceRegistry.DerefOne(schema), value)
  }
  function* Self(schema: Types.TSelf, value: string): IterableIterator<string> {
    const func = CreateFunctionName(schema.$ref)
    yield `${func}(${value})`
  }
  function* String(schema: Types.TString, value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'string')`
    if (IsNumber(schema.minLength)) yield `${value}.length >= ${schema.minLength}`
    if (IsNumber(schema.maxLength)) yield `${value}.length <= ${schema.maxLength}`
    if (schema.pattern !== undefined) {
      const local = PushLocal(`${new RegExp(schema.pattern)};`)
      yield `${local}.test(${value})`
    }
    if (schema.format !== undefined) {
      yield `format('${schema.format}', ${value})`
    }
  }
  function* Symbol(schema: Types.TSymbol, value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'symbol')`
  }
  function* Tuple(schema: Types.TTuple<any[]>, value: string): IterableIterator<string> {
    yield `(Array.isArray(${value}))`
    if (schema.items === undefined) return yield `${value}.length === 0`
    yield `(${value}.length === ${schema.maxItems})`
    for (let i = 0; i < schema.items.length; i++) {
      const expression = CreateExpression(schema.items[i], `${value}[${i}]`)
      yield `${expression}`
    }
  }
  function* Undefined(schema: Types.TUndefined, value: string): IterableIterator<string> {
    yield `${value} === undefined`
  }
  function* Union(schema: Types.TUnion<any[]>, value: string): IterableIterator<string> {
    const expressions = schema.anyOf.map((schema: Types.TSchema) => CreateExpression(schema, value))
    yield `(${expressions.join(' || ')})`
  }
  function* Uint8Array(schema: Types.TUint8Array, value: string): IterableIterator<string> {
    yield `${value} instanceof Uint8Array`
    if (IsNumber(schema.maxByteLength)) yield `(${value}.length <= ${schema.maxByteLength})`
    if (IsNumber(schema.minByteLength)) yield `(${value}.length >= ${schema.minByteLength})`
  }
  function* Unknown(schema: Types.TUnknown, value: string): IterableIterator<string> {
    yield 'true'
  }
  function* Void(schema: Types.TVoid, value: string): IterableIterator<string> {
    if (TypeSystem.AllowVoidNull) {
      yield `(${value} === undefined || ${value} === null)`
    } else {
      yield `${value} === undefined`
    }
  }
  function* UserDefined(schema: Types.TSchema, value: string): IterableIterator<string> {
    const schema_key = `schema_key_${state_remote_custom_types.size}`
    state_remote_custom_types.set(schema_key, schema)
    yield `custom('${schema[Types.Kind]}', '${schema_key}', ${value})`
  }
  function* Visit<T extends Types.TSchema>(schema: T, value: string): IterableIterator<string> {
    // Reference: Referenced schemas can originate from either additional schemas
    // or inline in the schema itself. Ideally the recursive path should align to
    // reference path. Consider for refactor.
    if (schema.$id && !state_local_function_names.has(schema.$id)) {
      state_local_function_names.add(schema.$id)
      const name = CreateFunctionName(schema.$id)
      const body = CreateFunction(name, schema, 'value')
      PushFunction(body)
      yield `${name}(${value})`
      return
    }
    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return yield* Any(anySchema, value)
      case 'Array':
        return yield* Array(anySchema, value)
      case 'BigInt':
        return yield* BigInt(anySchema, value)
      case 'Boolean':
        return yield* Boolean(anySchema, value)
      case 'Constructor':
        return yield* Constructor(anySchema, value)
      case 'Date':
        return yield* Date(anySchema, value)
      case 'Function':
        return yield* Function(anySchema, value)
      case 'Integer':
        return yield* Integer(anySchema, value)
      case 'Intersect':
        return yield* Intersect(anySchema, value)
      case 'Literal':
        return yield* Literal(anySchema, value)
      case 'Never':
        return yield* Never(anySchema, value)
      case 'Not':
        return yield* Not(anySchema, value)
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
      case 'Symbol':
        return yield* Symbol(anySchema, value)
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
        if (!Types.TypeRegistry.Has(anySchema[Types.Kind])) throw new TypeCompilerUnknownTypeError(schema)
        return yield* UserDefined(anySchema, value)
    }
  }
  // -------------------------------------------------------------------
  // Compiler State
  // -------------------------------------------------------------------
  const state_local_variables = new Set<string>() // local variables and functions
  const state_local_function_names = new Set<string>() // local function names used call ref validators
  const state_remote_custom_types = new Map<string, unknown>() // remote custom types used during compilation
  function ResetCompiler() {
    state_local_variables.clear()
    state_local_function_names.clear()
    state_remote_custom_types.clear()
  }
  function CreateExpression(schema: Types.TSchema, value: string): string {
    return `(${[...Visit(schema, value)].join(' && ')})`
  }
  function CreateFunctionName($id: string) {
    return `check_${Identifier.Encode($id)}`
  }
  function CreateFunction(name: string, schema: Types.TSchema, value: string): string {
    const expression = [...Visit(schema, value)].map((condition) => `    ${condition}`).join(' &&\n')
    return `function ${name}(value) {\n  return (\n${expression}\n )\n}`
  }
  function PushFunction(functionBody: string) {
    state_local_variables.add(functionBody)
  }
  function PushLocal(expression: string) {
    const local = `local_${state_local_variables.size}`
    state_local_variables.add(`const ${local} = ${expression}`)
    return local
  }
  function GetLocals() {
    return [...state_local_variables.values()]
  }
  // -------------------------------------------------------------------
  // Compile
  // -------------------------------------------------------------------
  function Build<T extends Types.TSchema>(schema: T): string {
    ResetCompiler()
    const check = CreateFunction('check', schema, 'value')
    const locals = GetLocals()
    return `${locals.join('\n')}\nreturn ${check}`
  }
  /** Returns the generated assertion code used to validate this type. */
  export function Code<T extends Types.TSchema>(schema: T) {
    if (!Types.TypeGuard.TSchema(schema)) throw new TypeCompilerPreflightCheckError(schema)
    return Build(schema)
  }
  /** Compiles the given type for runtime type checking. This compiler only accepts known TypeBox types non-inclusive of unsafe types. */
  export function Compile<T extends Types.TSchema>(schema: T): TypeCheck<T> {
    const code = Code(schema)
    const custom_schemas = new Map(state_remote_custom_types)
    const compiledFunction = globalThis.Function('custom', 'format', 'hash', code)
    const checkFunction = compiledFunction(
      (kind: string, schema_key: string, value: unknown) => {
        if (!Types.TypeRegistry.Has(kind) || !custom_schemas.has(schema_key)) return false
        const schema = custom_schemas.get(schema_key)!
        const func = Types.TypeRegistry.Get(kind)!
        return func(schema, value)
      },
      (format: string, value: string) => {
        if (!Types.FormatRegistry.Has(format)) return false
        const func = Types.FormatRegistry.Get(format)!
        return func(value)
      },
      (value: unknown) => {
        return ValueHash.Create(value)
      },
    )
    return new TypeCheck(schema, checkFunction, code)
  }
}
