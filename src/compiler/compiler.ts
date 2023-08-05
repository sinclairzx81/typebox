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

import { TypeSystem } from '../system/index'
import * as Types from '../typebox'
import * as ValueErrors from '../errors/index'
import * as ValueHash from '../value/hash'
import * as ValueGuard from '../value/guard'

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
  public Errors(value: unknown): ValueErrors.ValueErrorIterator {
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
// Errors
// -------------------------------------------------------------------
export class TypeCompilerUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('TypeCompiler: Unknown type')
  }
}
export class TypeCompilerDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef) {
    super(`TypeCompiler: Unable to dereference type with $id '${schema.$ref}'`)
  }
}
export class TypeCompilerTypeGuardError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('TypeCompiler: Preflight validation check failed to guard for the given schema')
  }
}
// -------------------------------------------------------------------
// TypeCompiler
// -------------------------------------------------------------------
export type TypeCompilerLanguageOption = 'typescript' | 'javascript'
export interface TypeCompilerOptions {
  language?: TypeCompilerLanguageOption
}
/** Compiles Types for Runtime Type Checking */
export namespace TypeCompiler {
  // ----------------------------------------------------------------------
  // Guards
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
  function* TAny(schema: Types.TAny, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield 'true'
  }
  function* TArray(schema: Types.TArray, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `Array.isArray(${value})`
    const [parameter, accumulator] = [CreateParameter('value', 'any'), CreateParameter('acc', 'number')]
    if (ValueGuard.IsNumber(schema.minItems)) yield `${value}.length >= ${schema.minItems}`
    if (ValueGuard.IsNumber(schema.maxItems)) yield `${value}.length <= ${schema.maxItems}`
    const elementExpression = CreateExpression(schema.items, references, 'value')
    yield `${value}.every((${parameter}) => ${elementExpression})`
    if (Types.TypeGuard.TSchema(schema.contains) || ValueGuard.IsNumber(schema.minContains) || ValueGuard.IsNumber(schema.maxContains)) {
      const containsSchema = Types.TypeGuard.TSchema(schema.contains) ? schema.contains : Types.Type.Never()
      const checkExpression = CreateExpression(containsSchema, references, 'value')
      const checkMinContains = ValueGuard.IsNumber(schema.minContains) ? [`(count >= ${schema.minContains})`] : []
      const checkMaxContains = ValueGuard.IsNumber(schema.maxContains) ? [`(count <= ${schema.maxContains})`] : []
      const checkCount = `const count = ${value}.reduce((${accumulator}, ${parameter}) => ${checkExpression} ? acc + 1 : acc, 0)`
      const check = [`(count > 0)`, ...checkMinContains, ...checkMaxContains].join(' && ')
      yield `((${parameter}) => { ${checkCount}; return ${check}})(${value})`
    }
    if (schema.uniqueItems === true) {
      const check = `const hashed = hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true`
      const block = `const set = new Set(); for(const element of value) { ${check} }`
      yield `((${parameter}) => { ${block} )(${value})`
    }
  }
  function* TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && Symbol.asyncIterator in ${value})`
  }
  function* TBigInt(schema: Types.TBigInt, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'bigint')`
    if (ValueGuard.IsBigInt(schema.multipleOf)) yield `(${value} % BigInt(${schema.multipleOf})) === 0`
    if (ValueGuard.IsBigInt(schema.exclusiveMinimum)) yield `${value} > BigInt(${schema.exclusiveMinimum})`
    if (ValueGuard.IsBigInt(schema.exclusiveMaximum)) yield `${value} < BigInt(${schema.exclusiveMaximum})`
    if (ValueGuard.IsBigInt(schema.minimum)) yield `${value} >= BigInt(${schema.minimum})`
    if (ValueGuard.IsBigInt(schema.maximum)) yield `${value} <= BigInt(${schema.maximum})`
  }
  function* TBoolean(schema: Types.TBoolean, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'boolean')`
  }
  function* TConstructor(schema: Types.TConstructor, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield* Visit(schema.returns, references, `${value}.prototype`)
  }
  function* TDate(schema: Types.TDate, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(${value} instanceof Date) && Number.isFinite(${value}.getTime())`
    if (ValueGuard.IsNumber(schema.exclusiveMinimumTimestamp)) yield `${value}.getTime() > ${schema.exclusiveMinimumTimestamp}`
    if (ValueGuard.IsNumber(schema.exclusiveMaximumTimestamp)) yield `${value}.getTime() < ${schema.exclusiveMaximumTimestamp}`
    if (ValueGuard.IsNumber(schema.minimumTimestamp)) yield `${value}.getTime() >= ${schema.minimumTimestamp}`
    if (ValueGuard.IsNumber(schema.maximumTimestamp)) yield `${value}.getTime() <= ${schema.maximumTimestamp}`
  }
  function* TFunction(schema: Types.TFunction, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'function')`
  }
  function* TInteger(schema: Types.TInteger, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'number' && Number.isInteger(${value}))`
    if (ValueGuard.IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
    if (ValueGuard.IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (ValueGuard.IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (ValueGuard.IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (ValueGuard.IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
  }
  function* TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: string): IterableIterator<string> {
    const check1 = schema.allOf.map((schema: Types.TSchema) => CreateExpression(schema, references, value)).join(' && ')
    if (schema.unevaluatedProperties === false) {
      const keyCheck = CreateVariable(`${new RegExp(Types.KeyResolver.ResolvePattern(schema))};`)
      const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key))`
      yield `(${check1} && ${check2})`
    } else if (Types.TypeGuard.TSchema(schema.unevaluatedProperties)) {
      const keyCheck = CreateVariable(`${new RegExp(Types.KeyResolver.ResolvePattern(schema))};`)
      const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key) || ${CreateExpression(schema.unevaluatedProperties, references, `${value}[key]`)})`
      yield `(${check1} && ${check2})`
    } else {
      yield `(${check1})`
    }
  }
  function* TIterator(schema: Types.TIterator, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && Symbol.iterator in ${value})`
  }
  function* TLiteral(schema: Types.TLiteral, references: Types.TSchema[], value: string): IterableIterator<string> {
    if (typeof schema.const === 'number' || typeof schema.const === 'boolean') {
      yield `(${value} === ${schema.const})`
    } else {
      yield `(${value} === '${schema.const}')`
    }
  }
  function* TNever(schema: Types.TNever, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `false`
  }
  function* TNot(schema: Types.TNot, references: Types.TSchema[], value: string): IterableIterator<string> {
    const expression = CreateExpression(schema.not, references, value)
    yield `(!${expression})`
  }
  function* TNull(schema: Types.TNull, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(${value} === null)`
  }
  function* TNumber(schema: Types.TNumber, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsNumberCheck(value)
    if (ValueGuard.IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
    if (ValueGuard.IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (ValueGuard.IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (ValueGuard.IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (ValueGuard.IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
  }
  function* TObject(schema: Types.TObject, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsObjectCheck(value)
    if (ValueGuard.IsNumber(schema.minProperties)) yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`
    if (ValueGuard.IsNumber(schema.maxProperties)) yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`
    const knownKeys = Object.getOwnPropertyNames(schema.properties)
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
  function* TPromise(schema: Types.TPromise<any>, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && typeof ${value}.then === 'function')`
  }
  function* TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsRecordCheck(value)
    if (ValueGuard.IsNumber(schema.minProperties)) yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`
    if (ValueGuard.IsNumber(schema.maxProperties)) yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`
    const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0]
    const variable = CreateVariable(`new RegExp(/${patternKey}/)`)
    const check1 = CreateExpression(patternSchema, references, 'value')
    const check2 = Types.TypeGuard.TSchema(schema.additionalProperties) ? CreateExpression(schema.additionalProperties, references, value) : schema.additionalProperties === false ? 'false' : 'true'
    const expression = `(${variable}.test(key) ? ${check1} : ${check2})`
    yield `(Object.entries(${value}).every(([key, value]) => ${expression}))`
  }
  function* TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: string): IterableIterator<string> {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new TypeCompilerDereferenceError(schema)
    const target = references[index]
    // Reference: If we have seen this reference before we can just yield and return the function call.
    // If this isn't the case we defer to visit to generate and set the function for subsequent passes.
    if (state.functions.has(schema.$ref)) return yield `${CreateFunctionName(schema.$ref)}(${value})`
    yield* Visit(target, references, value)
  }
  function* TString(schema: Types.TString, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'string')`
    if (ValueGuard.IsNumber(schema.minLength)) yield `${value}.length >= ${schema.minLength}`
    if (ValueGuard.IsNumber(schema.maxLength)) yield `${value}.length <= ${schema.maxLength}`
    if (schema.pattern !== undefined) {
      const variable = CreateVariable(`${new RegExp(schema.pattern)};`)
      yield `${variable}.test(${value})`
    }
    if (schema.format !== undefined) {
      yield `format('${schema.format}', ${value})`
    }
  }
  function* TSymbol(schema: Types.TSymbol, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'symbol')`
  }
  function* TTemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'string')`
    const variable = CreateVariable(`${new RegExp(schema.pattern)};`)
    yield `${variable}.test(${value})`
  }
  function* TThis(schema: Types.TThis, references: Types.TSchema[], value: string): IterableIterator<string> {
    const func = CreateFunctionName(schema.$ref)
    yield `${func}(${value})`
  }
  function* TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `Array.isArray(${value})`
    if (schema.items === undefined) return yield `${value}.length === 0`
    yield `(${value}.length === ${schema.maxItems})`
    for (let i = 0; i < schema.items.length; i++) {
      const expression = CreateExpression(schema.items[i], references, `${value}[${i}]`)
      yield `${expression}`
    }
  }
  function* TUndefined(schema: Types.TUndefined, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `${value} === undefined`
  }
  function* TUnion(schema: Types.TUnion<any[]>, references: Types.TSchema[], value: string): IterableIterator<string> {
    const expressions = schema.anyOf.map((schema: Types.TSchema) => CreateExpression(schema, references, value))
    yield `(${expressions.join(' || ')})`
  }
  function* TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield `${value} instanceof Uint8Array`
    if (ValueGuard.IsNumber(schema.maxByteLength)) yield `(${value}.length <= ${schema.maxByteLength})`
    if (ValueGuard.IsNumber(schema.minByteLength)) yield `(${value}.length >= ${schema.minByteLength})`
  }
  function* TUnknown(schema: Types.TUnknown, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield 'true'
  }
  function* TVoid(schema: Types.TVoid, references: Types.TSchema[], value: string): IterableIterator<string> {
    yield IsVoidCheck(value)
  }
  function* TKind(schema: Types.TSchema, references: Types.TSchema[], value: string): IterableIterator<string> {
    const instance = state.instances.size
    state.instances.set(instance, schema)
    yield `kind('${schema[Types.Kind]}', ${instance}, ${value})`
  }
  function* Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: string, useHoisting: boolean = true): IterableIterator<string> {
    const references_ = ValueGuard.IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    // ----------------------------------------------------------------------------------
    // Hoisting
    // ----------------------------------------------------------------------------------
    if (useHoisting && ValueGuard.IsString(schema.$id)) {
      const functionName = CreateFunctionName(schema.$id)
      if (state.functions.has(functionName)) {
        return yield `${functionName}(${value})`
      } else {
        const functionCode = CreateFunction(functionName, schema, references, 'value', false)
        state.functions.set(functionName, functionCode)
        return yield `${functionName}(${value})`
      }
    }
    // ----------------------------------------------------------------------------------
    // Types
    // ----------------------------------------------------------------------------------
    switch (schema_[Types.Kind]) {
      case 'Any':
        return yield* TAny(schema_, references_, value)
      case 'Array':
        return yield* TArray(schema_, references_, value)
      case 'AsyncIterator':
        return yield* TAsyncIterator(schema_, references_, value)
      case 'BigInt':
        return yield* TBigInt(schema_, references_, value)
      case 'Boolean':
        return yield* TBoolean(schema_, references_, value)
      case 'Constructor':
        return yield* TConstructor(schema_, references_, value)
      case 'Date':
        return yield* TDate(schema_, references_, value)
      case 'Function':
        return yield* TFunction(schema_, references_, value)
      case 'Integer':
        return yield* TInteger(schema_, references_, value)
      case 'Intersect':
        return yield* TIntersect(schema_, references_, value)
      case 'Iterator':
        return yield* TIterator(schema_, references_, value)
      case 'Literal':
        return yield* TLiteral(schema_, references_, value)
      case 'Never':
        return yield* TNever(schema_, references_, value)
      case 'Not':
        return yield* TNot(schema_, references_, value)
      case 'Null':
        return yield* TNull(schema_, references_, value)
      case 'Number':
        return yield* TNumber(schema_, references_, value)
      case 'Object':
        return yield* TObject(schema_, references_, value)
      case 'Promise':
        return yield* TPromise(schema_, references_, value)
      case 'Record':
        return yield* TRecord(schema_, references_, value)
      case 'Ref':
        return yield* TRef(schema_, references_, value)
      case 'String':
        return yield* TString(schema_, references_, value)
      case 'Symbol':
        return yield* TSymbol(schema_, references_, value)
      case 'TemplateLiteral':
        return yield* TTemplateLiteral(schema_, references_, value)
      case 'This':
        return yield* TThis(schema_, references_, value)
      case 'Tuple':
        return yield* TTuple(schema_, references_, value)
      case 'Undefined':
        return yield* TUndefined(schema_, references_, value)
      case 'Union':
        return yield* TUnion(schema_, references_, value)
      case 'Uint8Array':
        return yield* TUint8Array(schema_, references_, value)
      case 'Unknown':
        return yield* TUnknown(schema_, references_, value)
      case 'Void':
        return yield* TVoid(schema_, references_, value)
      default:
        if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new TypeCompilerUnknownTypeError(schema)
        return yield* TKind(schema_, references_, value)
    }
  }
  // -------------------------------------------------------------------
  // Compiler State
  // -------------------------------------------------------------------
  // prettier-ignore
  const state = {
    language: 'javascript',                       // target language
    functions: new Map<string, string>(),         // local functions
    variables: new Map<string, string>(),         // local variables
    instances: new Map<number, Types.TKind>()     // exterior kind instances
  }
  // -------------------------------------------------------------------
  // Compiler Factory
  // -------------------------------------------------------------------
  function CreateExpression(schema: Types.TSchema, references: Types.TSchema[], value: string, useHoisting: boolean = true): string {
    return `(${[...Visit(schema, references, value, useHoisting)].join(' && ')})`
  }
  function CreateFunctionName($id: string) {
    return `check_${Identifier.Encode($id)}`
  }
  function CreateVariable(expression: string) {
    const variableName = `local_${state.variables.size}`
    state.variables.set(variableName, `const ${variableName} = ${expression}`)
    return variableName
  }
  function CreateFunction(name: string, schema: Types.TSchema, references: Types.TSchema[], value: string, useHoisting: boolean = true): string {
    const [newline, pad] = ['\n', (length: number) => ''.padStart(length, ' ')]
    const parameter = CreateParameter('value', 'any')
    const returns = CreateReturns('boolean')
    const expression = [...Visit(schema, references, value, useHoisting)].map((expression) => `${pad(4)}${expression}`).join(` &&${newline}`)
    return `function ${name}(${parameter})${returns} {${newline}${pad(2)}return (${newline}${expression}${newline}${pad(2)})\n}`
  }
  function CreateParameter(name: string, type: string) {
    const annotation = state.language === 'typescript' ? `: ${type}` : ''
    return `${name}${annotation}`
  }
  function CreateReturns(type: string) {
    return state.language === 'typescript' ? `: ${type}` : ''
  }
  // -------------------------------------------------------------------
  // Compile
  // -------------------------------------------------------------------
  function Build<T extends Types.TSchema>(schema: T, references: Types.TSchema[], options: TypeCompilerOptions): string {
    const functionCode = CreateFunction('check', schema, references, 'value') // will populate functions and variables
    const parameter = CreateParameter('value', 'any')
    const returns = CreateReturns('boolean')
    const functions = [...state.functions.values()]
    const variables = [...state.variables.values()]
    // prettier-ignore
    const checkFunction = ValueGuard.IsString(schema.$id) // ensure top level schemas with $id's are hoisted
      ? `return function check(${parameter})${returns} {\n  return ${CreateFunctionName(schema.$id)}(value)\n}`
      : `return ${functionCode}`
    return [...variables, ...functions, checkFunction].join('\n')
  }
  /** Returns the generated assertion code used to validate this type. */
  export function Code<T extends Types.TSchema>(schema: T, references: Types.TSchema[], options?: TypeCompilerOptions): string
  /** Returns the generated assertion code used to validate this type. */
  export function Code<T extends Types.TSchema>(schema: T, options?: TypeCompilerOptions): string
  /** Returns the generated assertion code used to validate this type. */
  export function Code(...args: any[]) {
    const defaults = { language: 'javascript' }
    // prettier-ignore
    const [schema, references, options] = (
      args.length === 2 &&  ValueGuard.IsArray(args[1]) ? [args[0], args[1], defaults] :
      args.length === 2 && !ValueGuard.IsArray(args[1]) ? [args[0], [], args[1]] :
      args.length === 3 ? [args[0], args[1], args[2]] :
      args.length === 1 ? [args[0], [], defaults] :
      [null, [], defaults]
    )
    // compiler-reset
    state.language = options.language
    state.variables.clear()
    state.functions.clear()
    state.instances.clear()
    if (!Types.TypeGuard.TSchema(schema)) throw new TypeCompilerTypeGuardError(schema)
    for (const schema of references) if (!Types.TypeGuard.TSchema(schema)) throw new TypeCompilerTypeGuardError(schema)
    return Build(schema, references, options)
  }
  /** Compiles the given type for runtime type checking. This compiler only accepts known TypeBox types non-inclusive of unsafe types. */
  export function Compile<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = []): TypeCheck<T> {
    const generatedCode = Code(schema, references, { language: 'javascript' })
    const compiledFunction = globalThis.Function('kind', 'format', 'hash', generatedCode)
    const instances = new Map(state.instances)
    function typeRegistryFunction(kind: string, instance: number, value: unknown) {
      if (!Types.TypeRegistry.Has(kind) || !instances.has(instance)) return false
      const schema = instances.get(instance)
      const checkFunc = Types.TypeRegistry.Get(kind)!
      return checkFunc(schema, value)
    }
    function formatRegistryFunction(format: string, value: string) {
      if (!Types.FormatRegistry.Has(format)) return false
      const checkFunc = Types.FormatRegistry.Get(format)!
      return checkFunc(value)
    }
    function valueHashFunction(value: unknown) {
      return ValueHash.Hash(value)
    }
    const checkFunction = compiledFunction(typeRegistryFunction, formatRegistryFunction, valueHashFunction)
    return new TypeCheck(schema, references, checkFunction, generatedCode)
  }
}
