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
  constructor(private readonly schema: T, private readonly references: Types.TSchema[], private readonly checkFunc: CheckFunction, private readonly code: string) {}
  /** Returns the generated assertion code used to validate this type. */
  public Code(): string {
    return this.code
  }
  /** Returns an iterator for each error in this value. */
  public Errors(value: unknown): ValueErrorIterator {
    return ValueErrors.Errors(this.schema, this.references, value)
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
  export function IsUnderscore(code: number) {
    return code === 95
  }
  export function IsAlpha(code: number) {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
  }
  export function IsNumeric(code: number) {
    return code >= 48 && code <= 57
  }
}
// -------------------------------------------------------------------
// MemberExpression
// -------------------------------------------------------------------
namespace MemberExpression {
  function IsFirstCharacterNumeric(value: string) {
    if (value.length === 0) return false
    return Character.IsNumeric(value.charCodeAt(0))
  }
  function IsAccessor(value: string) {
    if (IsFirstCharacterNumeric(value)) return false
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      const check = Character.IsAlpha(code) || Character.IsNumeric(code) || Character.DollarSign(code) || Character.IsUnderscore(code)
      if (!check) return false
    }
    return true
  }
  function EscapeHyphen(key: string) {
    return key.replace(/'/g, "\\'")
  }
  export function Encode(object: string, key: string) {
    return IsAccessor(key) ? `${object}.${key}` : `${object}['${EscapeHyphen(key)}']`
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
      if (Character.IsNumeric(code) || Character.IsAlpha(code)) {
        buffer.push($id.charAt(i))
      } else {
        buffer.push(`_${code}_`)
      }
    }
    return buffer.join('').replace(/__/g, '_')
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
export class TypeCompilerDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef) {
    super(`TypeCompiler: Unable to dereference schema with $id '${schema.$ref}'`)
  }
}
export class TypeCompilerTypeGuardError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('TypeCompiler: Preflight validation check failed to guard for the given schema')
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
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  // -------------------------------------------------------------------
  // Polices
  // -------------------------------------------------------------------
  function IsExactOptionalProperty(value: string, key: string, expression: string) {
    return TypeSystem.ExactOptionalPropertyTypes ? `('${key}' in ${value} ? ${expression} : true)` : `(${MemberExpression.Encode(value, key)} !== undefined ? ${expression} : true)`
  }
  function IsObjectCheck(value: string): string {
    return !TypeSystem.AllowArrayObjects ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))` : `(typeof ${value} === 'object' && ${value} !== null)`
  }
  function IsRecordCheck(value: string): string {
    return !TypeSystem.AllowArrayObjects
      ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}) && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))`
      : `(typeof ${value} === 'object' && ${value} !== null && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))`
  }
  function IsNumberCheck(value: string): string {
    return !TypeSystem.AllowNaN ? `(typeof ${value} === 'number' && Number.isFinite(${value}))` : `typeof ${value} === 'number'`
  }
  function IsVoidCheck(value: string): string {
    return TypeSystem.AllowVoidNull ? `(${value} === undefined || ${value} === null)` : `${value} === undefined`
  }
  // -------------------------------------------------------------------
  // Types
  // -------------------------------------------------------------------
  function* Any(schema: Types.TAny, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield 'true'
  }
  function* Array(schema: Types.TArray, references: Types.TSchema[], value: string): IterableIterator<string> {
    const expression = CreateExpression(schema.items, references, 'value')
    yield `Array.isArray(${value}) && ${value}.every(value => ${expression})`
    if (IsNumber(schema.minItems)) yield `${value}.length >= ${schema.minItems}`
    if (IsNumber(schema.maxItems)) yield `${value}.length <= ${schema.maxItems}`
    if (schema.uniqueItems === true) yield `((function() { const set = new Set(); for(const element of ${value}) { const hashed = hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true })())`
  }
  function* BigInt(schema: Types.TBigInt, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'bigint')`
    if (IsBigInt(schema.multipleOf)) yield `(${value} % BigInt(${schema.multipleOf})) === 0`
    if (IsBigInt(schema.exclusiveMinimum)) yield `${value} > BigInt(${schema.exclusiveMinimum})`
    if (IsBigInt(schema.exclusiveMaximum)) yield `${value} < BigInt(${schema.exclusiveMaximum})`
    if (IsBigInt(schema.minimum)) yield `${value} >= BigInt(${schema.minimum})`
    if (IsBigInt(schema.maximum)) yield `${value} <= BigInt(${schema.maximum})`
  }
  function* Boolean(schema: Types.TBoolean, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `typeof ${value} === 'boolean'`
  }
  function* Constructor(schema: Types.TConstructor, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield* Visit(schema.returns, references, `${value}.prototype`)
  }
  function* Date(schema: Types.TDate, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(${value} instanceof Date) && Number.isFinite(${value}.getTime())`
    if (IsNumber(schema.exclusiveMinimumTimestamp)) yield `${value}.getTime() > ${schema.exclusiveMinimumTimestamp}`
    if (IsNumber(schema.exclusiveMaximumTimestamp)) yield `${value}.getTime() < ${schema.exclusiveMaximumTimestamp}`
    if (IsNumber(schema.minimumTimestamp)) yield `${value}.getTime() >= ${schema.minimumTimestamp}`
    if (IsNumber(schema.maximumTimestamp)) yield `${value}.getTime() <= ${schema.maximumTimestamp}`
  }
  function* Function(schema: Types.TFunction, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `typeof ${value} === 'function'`
  }
  function* Integer(schema: Types.TInteger, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'number' && Number.isInteger(${value}))`
    if (IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
    if (IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
  }
  function* Intersect(schema: Types.TIntersect, references: Types.TSchema[], value: string): IterableIterator<string> {
    if (schema.unevaluatedProperties === undefined) {
      const expressions = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, references, value))
      yield `${expressions.join(' && ')}`
    } else if (schema.unevaluatedProperties === false) {
      // prettier-ignore
      const schemaKeys = Types.KeyResolver.Resolve(schema).map((key) => `'${key}'`).join(', ')
      const expressions = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, references, value))
      const expression1 = `Object.getOwnPropertyNames(${value}).every(key => [${schemaKeys}].includes(key))`
      yield `${expressions.join(' && ')} && ${expression1}`
    } else if (typeof schema.unevaluatedProperties === 'object') {
      // prettier-ignore
      const schemaKeys = Types.KeyResolver.Resolve(schema).map((key) => `'${key}'`).join(', ')
      const expressions = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, references, value))
      const expression1 = CreateExpression(schema.unevaluatedProperties, references, 'value[key]')
      const expression2 = `Object.getOwnPropertyNames(${value}).every(key => [${schemaKeys}].includes(key) || ${expression1})`
      yield `${expressions.join(' && ')} && ${expression2}`
    }
  }
  function* Literal(schema: Types.TLiteral, references: Types.TSchema[], value: string): IterableIterator<string> {
    if (typeof schema.const === 'number' || typeof schema.const === 'boolean') {
      yield `${value} === ${schema.const}`
    } else {
      yield `${value} === '${schema.const}'`
    }
  }
  function* Never(schema: Types.TNever, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `false`
  }
  function* Not(schema: Types.TNot, references: Types.TSchema[], value: string): IterableIterator<string> {
    const left = CreateExpression(schema.allOf[0].not, references, value)
    const right = CreateExpression(schema.allOf[1], references, value)
    yield `!${left} && ${right}`
  }
  function* Null(schema: Types.TNull, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `${value} === null`
  }
  function* Number(schema: Types.TNumber, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsNumberCheck(value)
    if (IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
    if (IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
  }

  function* Object(schema: Types.TObject, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsObjectCheck(value)
    if (IsNumber(schema.minProperties)) yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`
    if (IsNumber(schema.maxProperties)) yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`
    const knownKeys = globalThis.Object.getOwnPropertyNames(schema.properties)
    for (const knownKey of knownKeys) {
      const memberExpression = MemberExpression.Encode(value, knownKey)
      const property = schema.properties[knownKey]
      if (schema.required && schema.required.includes(knownKey)) {
        yield* Visit(property, references, memberExpression)
        if (Types.ExtendsUndefined.Check(property)) yield `('${knownKey}' in ${value})`
      } else {
        const expression = CreateExpression(property, references, memberExpression)
        yield IsExactOptionalProperty(value, knownKey, expression)
      }
    }
    if (schema.additionalProperties === false) {
      if (schema.required && schema.required.length === knownKeys.length) {
        yield `Object.getOwnPropertyNames(${value}).length === ${knownKeys.length}`
      } else {
        const keys = `[${knownKeys.map((key) => `'${key}'`).join(', ')}]`
        yield `Object.getOwnPropertyNames(${value}).every(key => ${keys}.includes(key))`
      }
    }
    if (typeof schema.additionalProperties === 'object') {
      const expression = CreateExpression(schema.additionalProperties, references, 'value[key]')
      const keys = `[${knownKeys.map((key) => `'${key}'`).join(', ')}]`
      yield `(Object.getOwnPropertyNames(${value}).every(key => ${keys}.includes(key) || ${expression}))`
    }
  }
  function* Promise(schema: Types.TPromise<any>, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && typeof ${value}.then === 'function')`
  }
  function* Record(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsRecordCheck(value)
    if (IsNumber(schema.minProperties)) yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`
    if (IsNumber(schema.maxProperties)) yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const local = PushLocal(`new RegExp(/${keyPattern}/)`)
    yield `(Object.getOwnPropertyNames(${value}).every(key => ${local}.test(key)))`
    const expression = CreateExpression(valueSchema, references, 'value')
    yield `Object.values(${value}).every(value => ${expression})`
  }
  function* Ref(schema: Types.TRef<any>, references: Types.TSchema[], value: string): IterableIterator<string> {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new TypeCompilerDereferenceError(schema)
    const target = references[index]
    // Reference: If we have seen this reference before we can just yield and return
    // the function call. If this isn't the case we defer to visit to generate and
    // set the function for subsequent passes. Consider for refactor.
    if (state_local_function_names.has(schema.$ref)) return yield `${CreateFunctionName(schema.$ref)}(${value})`
    yield* Visit(target, references, value)
  }
  function* String(schema: Types.TString, references: Types.TSchema[], value: string): IterableIterator<string> {
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
  function* Symbol(schema: Types.TSymbol, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'symbol')`
  }
  function* TemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'string')`
    const local = PushLocal(`${new RegExp(schema.pattern)};`)
    yield `${local}.test(${value})`
  }
  function* This(schema: Types.TThis, references: Types.TSchema[], value: string): IterableIterator<string> {
    const func = CreateFunctionName(schema.$ref)
    yield `${func}(${value})`
  }
  function* Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(Array.isArray(${value}))`
    if (schema.items === undefined) return yield `${value}.length === 0`
    yield `(${value}.length === ${schema.maxItems})`
    for (let i = 0; i < schema.items.length; i++) {
      const expression = CreateExpression(schema.items[i], references, `${value}[${i}]`)
      yield `${expression}`
    }
  }
  function* Undefined(schema: Types.TUndefined, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `${value} === undefined`
  }
  function* Union(schema: Types.TUnion<any[]>, references: Types.TSchema[], value: string): IterableIterator<string> {
    const expressions = schema.anyOf.map((schema: Types.TSchema) => CreateExpression(schema, references, value))
    yield `(${expressions.join(' || ')})`
  }
  function* Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `${value} instanceof Uint8Array`
    if (IsNumber(schema.maxByteLength)) yield `(${value}.length <= ${schema.maxByteLength})`
    if (IsNumber(schema.minByteLength)) yield `(${value}.length >= ${schema.minByteLength})`
  }
  function* Unknown(schema: Types.TUnknown, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield 'true'
  }
  function* Void(schema: Types.TVoid, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsVoidCheck(value)
  }
  function* UserDefined(schema: Types.TSchema, references: Types.TSchema[], value: string): IterableIterator<string> {
    const schema_key = `schema_key_${state_remote_custom_types.size}`
    state_remote_custom_types.set(schema_key, schema)
    yield `custom('${schema[Types.Kind]}', '${schema_key}', ${value})`
  }
  function* Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: string): IterableIterator<string> {
    const references_ = IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    // Reference: Referenced schemas can originate from either additional schemas
    // or inline in the schema itself. Ideally the recursive path should align to
    // reference path. Consider for refactor.
    if (IsString(schema.$id) && !state_local_function_names.has(schema.$id)) {
      state_local_function_names.add(schema.$id)
      const name = CreateFunctionName(schema.$id)
      const body = CreateFunction(name, schema, references, 'value')
      PushFunction(body)
      yield `${name}(${value})`
      return
    }
    switch (schema_[Types.Kind]) {
      case 'Any':
        return yield* Any(schema_, references_, value)
      case 'Array':
        return yield* Array(schema_, references_, value)
      case 'BigInt':
        return yield* BigInt(schema_, references_, value)
      case 'Boolean':
        return yield* Boolean(schema_, references_, value)
      case 'Constructor':
        return yield* Constructor(schema_, references_, value)
      case 'Date':
        return yield* Date(schema_, references_, value)
      case 'Function':
        return yield* Function(schema_, references_, value)
      case 'Integer':
        return yield* Integer(schema_, references_, value)
      case 'Intersect':
        return yield* Intersect(schema_, references_, value)
      case 'Literal':
        return yield* Literal(schema_, references_, value)
      case 'Never':
        return yield* Never(schema_, references_, value)
      case 'Not':
        return yield* Not(schema_, references_, value)
      case 'Null':
        return yield* Null(schema_, references_, value)
      case 'Number':
        return yield* Number(schema_, references_, value)
      case 'Object':
        return yield* Object(schema_, references_, value)
      case 'Promise':
        return yield* Promise(schema_, references_, value)
      case 'Record':
        return yield* Record(schema_, references_, value)
      case 'Ref':
        return yield* Ref(schema_, references_, value)
      case 'String':
        return yield* String(schema_, references_, value)
      case 'Symbol':
        return yield* Symbol(schema_, references_, value)
      case 'TemplateLiteral':
        return yield* TemplateLiteral(schema_, references_, value)
      case 'This':
        return yield* This(schema_, references_, value)
      case 'Tuple':
        return yield* Tuple(schema_, references_, value)
      case 'Undefined':
        return yield* Undefined(schema_, references_, value)
      case 'Union':
        return yield* Union(schema_, references_, value)
      case 'Uint8Array':
        return yield* Uint8Array(schema_, references_, value)
      case 'Unknown':
        return yield* Unknown(schema_, references_, value)
      case 'Void':
        return yield* Void(schema_, references_, value)
      default:
        if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new TypeCompilerUnknownTypeError(schema)
        return yield* UserDefined(schema_, references_, value)
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
  function CreateExpression(schema: Types.TSchema, references: Types.TSchema[], value: string): string {
    return `(${[...Visit(schema, references, value)].join(' && ')})`
  }
  function CreateFunctionName($id: string) {
    return `check_${Identifier.Encode($id)}`
  }
  function CreateFunction(name: string, schema: Types.TSchema, references: Types.TSchema[], value: string): string {
    const expression = [...Visit(schema, references, value)].map((condition) => `    ${condition}`).join(' &&\n')
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
  function Build<T extends Types.TSchema>(schema: T, references: Types.TSchema[]): string {
    ResetCompiler()
    const check = CreateFunction('check', schema, references, 'value')
    const locals = GetLocals()
    return `${locals.join('\n')}\nreturn ${check}`
  }
  /** Returns the generated assertion code used to validate this type. */
  export function Code<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = []) {
    if (!Types.TypeGuard.TSchema(schema)) throw new TypeCompilerTypeGuardError(schema)
    for (const schema of references) if (!Types.TypeGuard.TSchema(schema)) throw new TypeCompilerTypeGuardError(schema)
    return Build(schema, references)
  }
  /** Compiles the given type for runtime type checking. This compiler only accepts known TypeBox types non-inclusive of unsafe types. */
  export function Compile<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = []): TypeCheck<T> {
    const code = Code(schema, references)
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
    return new TypeCheck(schema, references, checkFunction, code)
  }
}
