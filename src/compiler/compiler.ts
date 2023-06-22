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

export interface TypeCompilerOptions {
  language?: 'typescript' | 'javascript'
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
  // ----------------------------------------------------------------------
  // SchemaGuards
  // ----------------------------------------------------------------------
  function IsAnyOrUnknown(schema: Types.TSchema) {
    return schema[Types.Kind] === 'Any' || schema[Types.Kind] === 'Unknown'
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
    yield `Array.isArray(${value})`
    if (IsNumber(schema.minItems)) yield `${value}.length >= ${schema.minItems}`
    if (IsNumber(schema.maxItems)) yield `${value}.length <= ${schema.maxItems}`
    if (schema.uniqueItems === true) yield `((function() { const set = new Set(); for(const element of ${value}) { const hashed = hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true })())`
    const expression = CreateExpression(schema.items, references, 'value')
    const parameter = CreateParameter('value', 'any')
    yield `${value}.every((${parameter}) => ${expression})`
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
    yield `(typeof ${value} === 'boolean')`
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
    yield `(typeof ${value} === 'function')`
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
    const check1 = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, references, value)).join(' && ')
    if (schema.unevaluatedProperties === false) {
      const keyCheck = PushLocal(`${new RegExp(Types.KeyResolver.ResolvePattern(schema))};`)
      const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key))`
      yield `(${check1} && ${check2})`
    } else if (Types.TypeGuard.TSchema(schema.unevaluatedProperties)) {
      const keyCheck = PushLocal(`${new RegExp(Types.KeyResolver.ResolvePattern(schema))};`)
      const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key) || ${CreateExpression(schema.unevaluatedProperties, references, `${value}[key]`)})`
      yield `(${check1} && ${check2})`
    } else {
      yield `(${check1})`
    }
  }
  function* Literal(schema: Types.TLiteral, references: Types.TSchema[], value: string): IterableIterator<string> {
    if (typeof schema.const === 'number' || typeof schema.const === 'boolean') {
      yield `(${value} === ${schema.const})`
    } else {
      yield `(${value} === '${schema.const}')`
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
    yield `(${value} === null)`
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
        if (Types.ExtendsUndefined.Check(property) || IsAnyOrUnknown(property)) yield `('${knownKey}' in ${value})`
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
      const expression = CreateExpression(schema.additionalProperties, references, `${value}[key]`)
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
    const [patternKey, patternSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const local = PushLocal(`new RegExp(/${patternKey}/)`)
    const check1 = CreateExpression(patternSchema, references, 'value')
    const check2 = Types.TypeGuard.TSchema(schema.additionalProperties) ? CreateExpression(schema.additionalProperties, references, value) : schema.additionalProperties === false ? 'false' : 'true'
    const expression = `(${local}.test(key) ? ${check1} : ${check2})`
    yield `(Object.entries(${value}).every(([key, value]) => ${expression}))`
  }
  function* Ref(schema: Types.TRef<any>, references: Types.TSchema[], value: string): IterableIterator<string> {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new TypeCompilerDereferenceError(schema)
    const target = references[index]
    // Reference: If we have seen this reference before we can just yield and
    // return the function call. If this isn't the case we defer to visit to
    // generate and set the function for subsequent passes.
    if (state.functions.has(schema.$ref)) return yield `${CreateFunctionName(schema.$ref)}(${value})`
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
    yield `Array.isArray(${value})`
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
    const schema_key = `schema_key_${state.customs.size}`
    state.customs.set(schema_key, schema)
    yield `custom('${schema[Types.Kind]}', '${schema_key}', ${value})`
  }
  function* Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: string, root = false): IterableIterator<string> {
    const references_ = IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    // Rule: Types with identifiers are hoisted into their own functions.
    // The following will generate a function for the schema and yield the
    // call to that function. This call is only made if NOT the root type
    // which allows the generated function to yield its expression. The
    // root argument is only true when making calls via CreateFunction().
    // Note there is potential to omit the root argument and conditional
    // by refactoring the logic below. Consider for review.
    if (IsString(schema.$id)) {
      const name = CreateFunctionName(schema.$id)
      if (!state.functions.has(schema.$id)) {
        state.functions.add(schema.$id)
        const body = CreateFunction(name, schema, references, 'value')
        PushFunction(body)
      }
      if (!root) return yield `${name}(${value})`
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
  // prettier-ignore
  const state = {
    language: 'javascript' as TypeCompilerOptions['language'], // target language
    variables: new Set<string>(),                              // local variables
    functions: new Set<string>(),                              // local functions
    customs: new Map<string, unknown>(),                       // custom type data
  }
  function CreateFunctionName($id: string) {
    return `check_${Identifier.Encode($id)}`
  }
  function CreateExpression(schema: Types.TSchema, references: Types.TSchema[], value: string): string {
    return `(${[...Visit(schema, references, value)].join(' && ')})`
  }
  function CreateParameter(name: string, type: string) {
    const annotation = state.language === 'typescript' ? `: ${type}` : ''
    return `${name}${annotation}`
  }
  function CreateReturns(type: string) {
    return state.language === 'typescript' ? `: ${type}` : ''
  }
  function CreateFunction(name: string, schema: Types.TSchema, references: Types.TSchema[], value: string): string {
    const expression = [...Visit(schema, references, value, true)].map((condition) => `    ${condition}`).join(' &&\n')
    const parameter = CreateParameter('value', 'any')
    const returns = CreateReturns('boolean')
    return `function ${name}(${parameter})${returns} {\n  return (\n${expression}\n )\n}`
  }
  function PushFunction(functionBody: string) {
    state.variables.add(functionBody)
  }
  function PushLocal(expression: string) {
    const local = `local_${state.variables.size}`
    state.variables.add(`const ${local} = ${expression}`)
    return local
  }
  function GetLocals() {
    return [...state.variables.values()]
  }
  // -------------------------------------------------------------------
  // Compile
  // -------------------------------------------------------------------
  function Build<T extends Types.TSchema>(schema: T, references: Types.TSchema[]): string {
    const check = CreateFunction('check', schema, references, 'value') // interior visit
    const locals = GetLocals()
    const parameter = CreateParameter('value', 'any')
    const returns = CreateReturns('boolean')
    // prettier-ignore
    return IsString(schema.$id) // ensure top level schemas with $id's are hoisted
      ? `${locals.join('\n')}\nreturn function check(${parameter})${returns} {\n  return ${CreateFunctionName(schema.$id)}(value)\n}`
      : `${locals.join('\n')}\nreturn ${check}`
  }
  /** Returns the generated assertion code used to validate this type. */
  export function Code<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = [], options: TypeCompilerOptions = { language: 'javascript' }) {
    // compiler-reset
    state.language = options.language
    state.variables.clear()
    state.functions.clear()
    state.customs.clear()
    if (!Types.TypeGuard.TSchema(schema)) throw new TypeCompilerTypeGuardError(schema)
    for (const schema of references) if (!Types.TypeGuard.TSchema(schema)) throw new TypeCompilerTypeGuardError(schema)
    return Build(schema, references)
  }
  /** Compiles the given type for runtime type checking. This compiler only accepts known TypeBox types non-inclusive of unsafe types. */
  export function Compile<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = []): TypeCheck<T> {
    const code = Code(schema, references, { language: 'javascript' })
    const customs = new Map(state.customs)
    const compiledFunction = globalThis.Function('custom', 'format', 'hash', code)
    const checkFunction = compiledFunction(
      (kind: string, schema_key: string, value: unknown) => {
        if (!Types.TypeRegistry.Has(kind) || !customs.has(schema_key)) return false
        const schema = customs.get(schema_key)!
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
