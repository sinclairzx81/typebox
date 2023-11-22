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

import { TransformEncode, TransformDecode, HasTransform, TransformDecodeCheckError, TransformEncodeCheckError } from '../value/transform/index'
import { IsArray, IsString, IsNumber, IsBigInt } from '../value/guard/index'
import { Errors, ValueErrorIterator } from '../errors/index'
import { TypeSystemPolicy } from '../system/index'
import { Deref } from '../value/deref/index'
import { Hash } from '../value/hash/index'
import { Kind } from '../type/symbols/index'

import { TSchema as IsSchemaType } from '../type/guard/type'
import { TypeRegistry, FormatRegistry } from '../type/registry/index'
import { KeyOfPattern } from '../type/keyof/index'
import { ExtendsUndefinedCheck } from '../type/extends/extends-undefined'

import type { TSchema } from '../type/schema/index'
import type { TAsyncIterator } from '../type/async-iterator/index'
import type { TAny } from '../type/any/index'
import type { TArray } from '../type/array/index'
import type { TBigInt } from '../type/bigint/index'
import type { TBoolean } from '../type/boolean/index'
import type { TDate } from '../type/date/index'
import type { TConstructor } from '../type/constructor/index'
import type { TFunction } from '../type/function/index'
import type { TInteger } from '../type/integer/index'
import type { TIntersect } from '../type/intersect/index'
import type { TIterator } from '../type/iterator/index'
import type { TLiteral } from '../type/literal/index'
import { Never, type TNever } from '../type/never/index'
import type { TNot } from '../type/not/index'
import type { TNull } from '../type/null/index'
import type { TNumber } from '../type/number/index'
import type { TObject } from '../type/object/index'
import type { TPromise } from '../type/promise/index'
import type { TRecord } from '../type/record/index'
import type { TRef } from '../type/ref/index'
import type { TTemplateLiteral } from '../type/template-literal/index'
import type { TThis } from '../type/recursive/index'
import type { TTuple } from '../type/tuple/index'
import type { TUnion } from '../type/union/index'
import type { TUnknown } from '../type/unknown/index'
import type { Static, StaticDecode, StaticEncode } from '../type/static/index'
import type { TString } from '../type/string/index'
import type { TSymbol } from '../type/symbol/index'
import type { TUndefined } from '../type/undefined/index'
import type { TUint8Array } from '../type/uint8array/index'
import type { TVoid } from '../type/void/index'

// ------------------------------------------------------------------
// CheckFunction
// ------------------------------------------------------------------
export type CheckFunction = (value: unknown) => boolean
// ------------------------------------------------------------------
// TypeCheck
// ------------------------------------------------------------------
export class TypeCheck<T extends TSchema> {
  private readonly hasTransform: boolean
  constructor(private readonly schema: T, private readonly references: TSchema[], private readonly checkFunc: CheckFunction, private readonly code: string) {
    this.hasTransform = HasTransform(schema, references)
  }
  /** Returns the generated assertion code used to validate this type. */
  public Code(): string {
    return this.code
  }
  /** Returns an iterator for each error in this value. */
  public Errors(value: unknown): ValueErrorIterator {
    return Errors(this.schema, this.references, value)
  }
  /** Returns true if the value matches the compiled type. */
  public Check(value: unknown): value is Static<T> {
    return this.checkFunc(value)
  }
  /** Decodes a value or throws if error */
  public Decode(value: unknown): StaticDecode<T> {
    if (!this.checkFunc(value)) throw new TransformDecodeCheckError(this.schema, value, this.Errors(value).First()!)
    return this.hasTransform ? TransformDecode(this.schema, this.references, value) : value
  }
  /** Encodes a value or throws if error */
  public Encode(value: unknown): StaticEncode<T> {
    const encoded = this.hasTransform ? TransformEncode(this.schema, this.references, value) : value
    if (!this.checkFunc(encoded)) throw new TransformEncodeCheckError(this.schema, value, this.Errors(value).First()!)
    return encoded
  }
}
// ------------------------------------------------------------------
// Character
// ------------------------------------------------------------------
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
// ------------------------------------------------------------------
// MemberExpression
// ------------------------------------------------------------------
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
// ------------------------------------------------------------------
// Identifier
// ------------------------------------------------------------------
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
// ------------------------------------------------------------------
// LiteralString
// ------------------------------------------------------------------
namespace LiteralString {
  export function Escape(content: string) {
    return content.replace(/'/g, "\\'")
  }
}
// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class TypeCompilerUnknownTypeError extends Error {
  constructor(public readonly schema: TSchema) {
    super('Unknown type')
  }
}
export class TypeCompilerTypeGuardError extends Error {
  constructor(public readonly schema: TSchema) {
    super('Preflight validation check failed to guard for the given schema')
  }
}
// ------------------------------------------------------------------
// Policy
// ------------------------------------------------------------------
export namespace Policy {
  export function IsExactOptionalProperty(value: string, key: string, expression: string) {
    return TypeSystemPolicy.ExactOptionalPropertyTypes ? `('${key}' in ${value} ? ${expression} : true)` : `(${MemberExpression.Encode(value, key)} !== undefined ? ${expression} : true)`
  }
  export function IsObjectLike(value: string): string {
    return !TypeSystemPolicy.AllowArrayObject ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))` : `(typeof ${value} === 'object' && ${value} !== null)`
  }
  export function IsRecordLike(value: string): string {
    return !TypeSystemPolicy.AllowArrayObject
      ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}) && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))`
      : `(typeof ${value} === 'object' && ${value} !== null && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))`
  }
  export function IsNumberLike(value: string): string {
    return !TypeSystemPolicy.AllowNaN ? `(typeof ${value} === 'number' && Number.isFinite(${value}))` : `typeof ${value} === 'number'`
  }
  export function IsVoidLike(value: string): string {
    return TypeSystemPolicy.AllowNullVoid ? `(${value} === undefined || ${value} === null)` : `${value} === undefined`
  }
}
// ------------------------------------------------------------------
// TypeCompiler
// ------------------------------------------------------------------
export type TypeCompilerLanguageOption = 'typescript' | 'javascript'
export interface TypeCompilerCodegenOptions {
  language?: TypeCompilerLanguageOption
}
/** Compiles Types for Runtime Type Checking */
export namespace TypeCompiler {
  // ----------------------------------------------------------------
  // Guards
  // ----------------------------------------------------------------
  function IsAnyOrUnknown(schema: TSchema) {
    return schema[Kind] === 'Any' || schema[Kind] === 'Unknown'
  }
  // ----------------------------------------------------------------
  // Types
  // ----------------------------------------------------------------
  function* TAny(schema: TAny, references: TSchema[], value: string): IterableIterator<string> {
    yield 'true'
  }
  function* TArray(schema: TArray, references: TSchema[], value: string): IterableIterator<string> {
    yield `Array.isArray(${value})`
    const [parameter, accumulator] = [CreateParameter('value', 'any'), CreateParameter('acc', 'number')]
    if (IsNumber(schema.maxItems)) yield `${value}.length <= ${schema.maxItems}`
    if (IsNumber(schema.minItems)) yield `${value}.length >= ${schema.minItems}`
    const elementExpression = CreateExpression(schema.items, references, 'value')
    yield `${value}.every((${parameter}) => ${elementExpression})`
    if (IsSchemaType(schema.contains) || IsNumber(schema.minContains) || IsNumber(schema.maxContains)) {
      const containsSchema = IsSchemaType(schema.contains) ? schema.contains : Never()
      const checkExpression = CreateExpression(containsSchema, references, 'value')
      const checkMinContains = IsNumber(schema.minContains) ? [`(count >= ${schema.minContains})`] : []
      const checkMaxContains = IsNumber(schema.maxContains) ? [`(count <= ${schema.maxContains})`] : []
      const checkCount = `const count = value.reduce((${accumulator}, ${parameter}) => ${checkExpression} ? acc + 1 : acc, 0)`
      const check = [`(count > 0)`, ...checkMinContains, ...checkMaxContains].join(' && ')
      yield `((${parameter}) => { ${checkCount}; return ${check}})(${value})`
    }
    if (schema.uniqueItems === true) {
      const check = `const hashed = hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true`
      const block = `const set = new Set(); for(const element of value) { ${check} }`
      yield `((${parameter}) => { ${block} )(${value})`
    }
  }
  function* TAsyncIterator(schema: TAsyncIterator, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && Symbol.asyncIterator in ${value})`
  }
  function* TBigInt(schema: TBigInt, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'bigint')`
    if (IsBigInt(schema.exclusiveMaximum)) yield `${value} < BigInt(${schema.exclusiveMaximum})`
    if (IsBigInt(schema.exclusiveMinimum)) yield `${value} > BigInt(${schema.exclusiveMinimum})`
    if (IsBigInt(schema.maximum)) yield `${value} <= BigInt(${schema.maximum})`
    if (IsBigInt(schema.minimum)) yield `${value} >= BigInt(${schema.minimum})`
    if (IsBigInt(schema.multipleOf)) yield `(${value} % BigInt(${schema.multipleOf})) === 0`
  }
  function* TBoolean(schema: TBoolean, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'boolean')`
  }
  function* TConstructor(schema: TConstructor, references: TSchema[], value: string): IterableIterator<string> {
    yield* Visit(schema.returns, references, `${value}.prototype`)
  }
  function* TDate(schema: TDate, references: TSchema[], value: string): IterableIterator<string> {
    yield `(${value} instanceof Date) && Number.isFinite(${value}.getTime())`
    if (IsNumber(schema.exclusiveMaximumTimestamp)) yield `${value}.getTime() < ${schema.exclusiveMaximumTimestamp}`
    if (IsNumber(schema.exclusiveMinimumTimestamp)) yield `${value}.getTime() > ${schema.exclusiveMinimumTimestamp}`
    if (IsNumber(schema.maximumTimestamp)) yield `${value}.getTime() <= ${schema.maximumTimestamp}`
    if (IsNumber(schema.minimumTimestamp)) yield `${value}.getTime() >= ${schema.minimumTimestamp}`
    if (IsNumber(schema.multipleOfTimestamp)) yield `(${value}.getTime() % ${schema.multipleOfTimestamp}) === 0`
  }
  function* TFunction(schema: TFunction, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'function')`
  }
  function* TInteger(schema: TInteger, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'number' && Number.isInteger(${value}))`
    if (IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
    if (IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
  }
  function* TIntersect(schema: TIntersect, references: TSchema[], value: string): IterableIterator<string> {
    const check1 = schema.allOf.map((schema: TSchema) => CreateExpression(schema, references, value)).join(' && ')
    if (schema.unevaluatedProperties === false) {
      const keyCheck = CreateVariable(`${new RegExp(KeyOfPattern(schema))};`)
      const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key))`
      yield `(${check1} && ${check2})`
    } else if (IsSchemaType(schema.unevaluatedProperties)) {
      const keyCheck = CreateVariable(`${new RegExp(KeyOfPattern(schema))};`)
      const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key) || ${CreateExpression(schema.unevaluatedProperties, references, `${value}[key]`)})`
      yield `(${check1} && ${check2})`
    } else {
      yield `(${check1})`
    }
  }
  function* TIterator(schema: TIterator, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && Symbol.iterator in ${value})`
  }
  function* TLiteral(schema: TLiteral, references: TSchema[], value: string): IterableIterator<string> {
    if (typeof schema.const === 'number' || typeof schema.const === 'boolean') {
      yield `(${value} === ${schema.const})`
    } else {
      yield `(${value} === '${LiteralString.Escape(schema.const)}')`
    }
  }
  function* TNever(schema: TNever, references: TSchema[], value: string): IterableIterator<string> {
    yield `false`
  }
  function* TNot(schema: TNot, references: TSchema[], value: string): IterableIterator<string> {
    const expression = CreateExpression(schema.not, references, value)
    yield `(!${expression})`
  }
  function* TNull(schema: TNull, references: TSchema[], value: string): IterableIterator<string> {
    yield `(${value} === null)`
  }
  function* TNumber(schema: TNumber, references: TSchema[], value: string): IterableIterator<string> {
    yield Policy.IsNumberLike(value)
    if (IsNumber(schema.exclusiveMaximum)) yield `${value} < ${schema.exclusiveMaximum}`
    if (IsNumber(schema.exclusiveMinimum)) yield `${value} > ${schema.exclusiveMinimum}`
    if (IsNumber(schema.maximum)) yield `${value} <= ${schema.maximum}`
    if (IsNumber(schema.minimum)) yield `${value} >= ${schema.minimum}`
    if (IsNumber(schema.multipleOf)) yield `(${value} % ${schema.multipleOf}) === 0`
  }
  function* TObject(schema: TObject, references: TSchema[], value: string): IterableIterator<string> {
    yield Policy.IsObjectLike(value)
    if (IsNumber(schema.minProperties)) yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`
    if (IsNumber(schema.maxProperties)) yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`
    const knownKeys = Object.getOwnPropertyNames(schema.properties)
    for (const knownKey of knownKeys) {
      const memberExpression = MemberExpression.Encode(value, knownKey)
      const property = schema.properties[knownKey]
      if (schema.required && schema.required.includes(knownKey)) {
        yield* Visit(property, references, memberExpression)
        if (ExtendsUndefinedCheck(property) || IsAnyOrUnknown(property)) yield `('${knownKey}' in ${value})`
      } else {
        const expression = CreateExpression(property, references, memberExpression)
        yield Policy.IsExactOptionalProperty(value, knownKey, expression)
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
  function* TPromise(schema: TPromise<any>, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof value === 'object' && typeof ${value}.then === 'function')`
  }
  function* TRecord(schema: TRecord<any, any>, references: TSchema[], value: string): IterableIterator<string> {
    yield Policy.IsRecordLike(value)
    if (IsNumber(schema.minProperties)) yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`
    if (IsNumber(schema.maxProperties)) yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`
    const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0]
    const variable = CreateVariable(`${new RegExp(patternKey)}`)
    const check1 = CreateExpression(patternSchema, references, 'value')
    const check2 = IsSchemaType(schema.additionalProperties) ? CreateExpression(schema.additionalProperties, references, value) : schema.additionalProperties === false ? 'false' : 'true'
    const expression = `(${variable}.test(key) ? ${check1} : ${check2})`
    yield `(Object.entries(${value}).every(([key, value]) => ${expression}))`
  }
  function* TRef(schema: TRef<any>, references: TSchema[], value: string): IterableIterator<string> {
    const target = Deref(schema, references)
    // Reference: If we have seen this reference before we can just yield and return the function call.
    // If this isn't the case we defer to visit to generate and set the function for subsequent passes.
    if (state.functions.has(schema.$ref)) return yield `${CreateFunctionName(schema.$ref)}(${value})`
    yield* Visit(target, references, value)
  }
  function* TString(schema: TString, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'string')`
    if (IsNumber(schema.maxLength)) yield `${value}.length <= ${schema.maxLength}`
    if (IsNumber(schema.minLength)) yield `${value}.length >= ${schema.minLength}`
    if (schema.pattern !== undefined) {
      const variable = CreateVariable(`${new RegExp(schema.pattern)};`)
      yield `${variable}.test(${value})`
    }
    if (schema.format !== undefined) {
      yield `format('${schema.format}', ${value})`
    }
  }
  function* TSymbol(schema: TSymbol, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'symbol')`
  }
  function* TTemplateLiteral(schema: TTemplateLiteral, references: TSchema[], value: string): IterableIterator<string> {
    yield `(typeof ${value} === 'string')`
    const variable = CreateVariable(`${new RegExp(schema.pattern)};`)
    yield `${variable}.test(${value})`
  }
  function* TThis(schema: TThis, references: TSchema[], value: string): IterableIterator<string> {
    // Note: This types are assured to be hoisted prior to this call. Just yield the function.
    yield `${CreateFunctionName(schema.$ref)}(${value})`
  }
  function* TTuple(schema: TTuple<any[]>, references: TSchema[], value: string): IterableIterator<string> {
    yield `Array.isArray(${value})`
    if (schema.items === undefined) return yield `${value}.length === 0`
    yield `(${value}.length === ${schema.maxItems})`
    for (let i = 0; i < schema.items.length; i++) {
      const expression = CreateExpression(schema.items[i], references, `${value}[${i}]`)
      yield `${expression}`
    }
  }
  function* TUndefined(schema: TUndefined, references: TSchema[], value: string): IterableIterator<string> {
    yield `${value} === undefined`
  }
  function* TUnion(schema: TUnion<any[]>, references: TSchema[], value: string): IterableIterator<string> {
    const expressions = schema.anyOf.map((schema: TSchema) => CreateExpression(schema, references, value))
    yield `(${expressions.join(' || ')})`
  }
  function* TUint8Array(schema: TUint8Array, references: TSchema[], value: string): IterableIterator<string> {
    yield `${value} instanceof Uint8Array`
    if (IsNumber(schema.maxByteLength)) yield `(${value}.length <= ${schema.maxByteLength})`
    if (IsNumber(schema.minByteLength)) yield `(${value}.length >= ${schema.minByteLength})`
  }
  function* TUnknown(schema: TUnknown, references: TSchema[], value: string): IterableIterator<string> {
    yield 'true'
  }
  function* TVoid(schema: TVoid, references: TSchema[], value: string): IterableIterator<string> {
    yield Policy.IsVoidLike(value)
  }
  function* TKind(schema: TSchema, references: TSchema[], value: string): IterableIterator<string> {
    const instance = state.instances.size
    state.instances.set(instance, schema)
    yield `kind('${schema[Kind]}', ${instance}, ${value})`
  }
  function* Visit<T extends TSchema>(schema: T, references: TSchema[], value: string, useHoisting: boolean = true): IterableIterator<string> {
    const references_ = IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    // --------------------------------------------------------------
    // Hoisting
    // --------------------------------------------------------------
    if (useHoisting && IsString(schema.$id)) {
      const functionName = CreateFunctionName(schema.$id)
      if (state.functions.has(functionName)) {
        return yield `${functionName}(${value})`
      } else {
        const functionCode = CreateFunction(functionName, schema, references, 'value', false)
        state.functions.set(functionName, functionCode)
        return yield `${functionName}(${value})`
      }
    }
    switch (schema_[Kind]) {
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
        if (!TypeRegistry.Has(schema_[Kind])) throw new TypeCompilerUnknownTypeError(schema)
        return yield* TKind(schema_, references_, value)
    }
  }
  // ----------------------------------------------------------------
  // Compiler State
  // ----------------------------------------------------------------
  // prettier-ignore
  const state = {
    language: 'javascript',                   // target language
    functions: new Map<string, string>(),     // local functions
    variables: new Map<string, string>(),     // local variables
    instances: new Map<number, TSchema>()     // exterior kind instances
  }
  // ----------------------------------------------------------------
  // Compiler Factory
  // ----------------------------------------------------------------
  function CreateExpression(schema: TSchema, references: TSchema[], value: string, useHoisting: boolean = true): string {
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
  function CreateFunction(name: string, schema: TSchema, references: TSchema[], value: string, useHoisting: boolean = true): string {
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
  // ----------------------------------------------------------------
  // Compile
  // ----------------------------------------------------------------
  function Build<T extends TSchema>(schema: T, references: TSchema[], options: TypeCompilerCodegenOptions): string {
    const functionCode = CreateFunction('check', schema, references, 'value') // will populate functions and variables
    const parameter = CreateParameter('value', 'any')
    const returns = CreateReturns('boolean')
    const functions = [...state.functions.values()]
    const variables = [...state.variables.values()]
    // prettier-ignore
    const checkFunction = IsString(schema.$id) // ensure top level schemas with $id's are hoisted
      ? `return function check(${parameter})${returns} {\n  return ${CreateFunctionName(schema.$id)}(value)\n}`
      : `return ${functionCode}`
    return [...variables, ...functions, checkFunction].join('\n')
  }
  /** Generates the code used to assert this type and returns it as a string */
  export function Code<T extends TSchema>(schema: T, references: TSchema[], options?: TypeCompilerCodegenOptions): string
  /** Generates the code used to assert this type and returns it as a string */
  export function Code<T extends TSchema>(schema: T, options?: TypeCompilerCodegenOptions): string
  /** Generates the code used to assert this type and returns it as a string */
  export function Code(...args: any[]) {
    const defaults = { language: 'javascript' }
    // prettier-ignore
    const [schema, references, options] = (
      args.length === 2 &&  IsArray(args[1]) ? [args[0], args[1], defaults] :
      args.length === 2 && !IsArray(args[1]) ? [args[0], [], args[1]] :
      args.length === 3 ? [args[0], args[1], args[2]] :
      args.length === 1 ? [args[0], [], defaults] :
      [null, [], defaults]
    )
    // compiler-reset
    state.language = options.language
    state.variables.clear()
    state.functions.clear()
    state.instances.clear()
    if (!IsSchemaType(schema)) throw new TypeCompilerTypeGuardError(schema)
    for (const schema of references) if (!IsSchemaType(schema)) throw new TypeCompilerTypeGuardError(schema)
    return Build(schema, references, options)
  }
  /** Compiles a TypeBox type for optimal runtime type checking. Types must be valid TypeBox types of TSchema */
  export function Compile<T extends TSchema>(schema: T, references: TSchema[] = []): TypeCheck<T> {
    const generatedCode = Code(schema, references, { language: 'javascript' })
    const compiledFunction = globalThis.Function('kind', 'format', 'hash', generatedCode)
    const instances = new Map(state.instances)
    function typeRegistryFunction(kind: string, instance: number, value: unknown) {
      if (!TypeRegistry.Has(kind) || !instances.has(instance)) return false
      const checkFunc = TypeRegistry.Get(kind)!
      const schema = instances.get(instance)!
      return checkFunc(schema, value)
    }
    function formatRegistryFunction(format: string, value: string) {
      if (!FormatRegistry.Has(format)) return false
      const checkFunc = FormatRegistry.Get(format)!
      return checkFunc(value)
    }
    function hashFunction(value: unknown) {
      return Hash(value)
    }
    const checkFunction = compiledFunction(typeRegistryFunction, formatRegistryFunction, hashFunction)
    return new TypeCheck(schema, references, checkFunction, generatedCode)
  }
}
