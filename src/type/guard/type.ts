/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import * as ValueGuard from './value'
import { Kind, Hint, TransformKind, ReadonlyKind, OptionalKind } from '../symbols/index'

import type { TransformOptions } from '../transform/index'
import type { TTemplateLiteral, TTemplateLiteralKind } from '../template-literal/index'
import type { TArray } from '../array/index'
import type { TBoolean } from '../boolean/index'
import type { TRecord } from '../record/index'
import type { TString } from '../string/index'
import type { TUnion } from '../union/index'
import type { TAny } from '../any/index'
import type { TAsyncIterator } from '../async-iterator/index'
import type { TBigInt } from '../bigint/index'
import type { TConstructor } from '../constructor/index'
import type { TFunction } from '../function/index'
import type { TInteger } from '../integer/index'
import type { TIntersect } from '../intersect/index'
import type { TIterator } from '../iterator/index'
import type { TLiteral, TLiteralValue } from '../literal/index'
import type { TMappedKey, TMappedResult } from '../mapped/index'
import type { TNever } from '../never/index'
import type { TNot } from '../not/index'
import type { TNull } from '../null/index'
import type { TNumber } from '../number/index'
import type { TObject, TAdditionalProperties, TProperties } from '../object/index'
import type { TOptional } from '../optional/index'
import type { TPromise } from '../promise/index'
import type { TReadonly } from '../readonly/index'
import type { TRef } from '../ref/index'
import type { TSchema } from '../schema/index'
import type { TSymbol } from '../symbol/index'
import type { TTuple } from '../tuple/index'
import type { TUint8Array } from '../uint8array/index'
import type { TUndefined } from '../undefined/index'
import type { TUnknown } from '../unknown/index'
import type { TUnsafe } from '../unsafe/index'
import type { TVoid } from '../void/index'
import type { TDate } from '../date/index'
import type { TThis } from '../recursive/index'

export class TypeGuardUnknownTypeError extends Error {}

const KnownTypes = [
  'Any',
  'Array',
  'AsyncIterator',
  'BigInt',
  'Boolean',
  'Constructor',
  'Date',
  'Enum',
  'Function',
  'Integer',
  'Intersect',
  'Iterator',
  'Literal',
  'MappedKey',
  'MappedResult',
  'Not',
  'Null',
  'Number',
  'Object',
  'Promise',
  'Record',
  'Ref',
  'String',
  'Symbol',
  'TemplateLiteral',
  'This',
  'Tuple',
  'Undefined',
  'Union',
  'Uint8Array',
  'Unknown',
  'Void',
]
function IsPattern(value: unknown): value is string {
  try {
    new RegExp(value as string)
    return true
  } catch {
    return false
  }
}
function IsControlCharacterFree(value: unknown): value is string {
  if (!ValueGuard.IsString(value)) return false
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if ((code >= 7 && code <= 13) || code === 27 || code === 127) {
      return false
    }
  }
  return true
}
function IsAdditionalProperties(value: unknown): value is TAdditionalProperties {
  return IsOptionalBoolean(value) || TSchema(value)
}
function IsOptionalBigInt(value: unknown): value is bigint | undefined {
  return ValueGuard.IsUndefined(value) || ValueGuard.IsBigInt(value)
}
function IsOptionalNumber(value: unknown): value is number | undefined {
  return ValueGuard.IsUndefined(value) || ValueGuard.IsNumber(value)
}
function IsOptionalBoolean(value: unknown): value is boolean | undefined {
  return ValueGuard.IsUndefined(value) || ValueGuard.IsBoolean(value)
}
function IsOptionalString(value: unknown): value is string | undefined {
  return ValueGuard.IsUndefined(value) || ValueGuard.IsString(value)
}
function IsOptionalPattern(value: unknown): value is string | undefined {
  return ValueGuard.IsUndefined(value) || (ValueGuard.IsString(value) && IsControlCharacterFree(value) && IsPattern(value))
}
function IsOptionalFormat(value: unknown): value is string | undefined {
  return ValueGuard.IsUndefined(value) || (ValueGuard.IsString(value) && IsControlCharacterFree(value))
}
function IsOptionalSchema(value: unknown): value is boolean | undefined {
  return ValueGuard.IsUndefined(value) || TSchema(value)
}
// ------------------------------------------------------------------
// Modifiers
// ------------------------------------------------------------------
/** Returns true if this value has a Readonly symbol */
export function TReadonly<T extends TSchema>(value: T): value is TReadonly<T> {
  return ValueGuard.IsObject(value) && value[ReadonlyKind] === 'Readonly'
}
/** Returns true if this value has a Optional symbol */
export function TOptional<T extends TSchema>(value: T): value is TOptional<T> {
  return ValueGuard.IsObject(value) && value[OptionalKind] === 'Optional'
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
/** Returns true if the given value is TAny */
export function TAny(value: unknown): value is TAny {
  // prettier-ignore
  return (
    TKindOf(value, 'Any') &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TArray */
export function TArray(value: unknown): value is TArray {
  return (
    TKindOf(value, 'Array') &&
    value.type === 'array' &&
    IsOptionalString(value.$id) &&
    TSchema(value.items) &&
    IsOptionalNumber(value.minItems) &&
    IsOptionalNumber(value.maxItems) &&
    IsOptionalBoolean(value.uniqueItems) &&
    IsOptionalSchema(value.contains) &&
    IsOptionalNumber(value.minContains) &&
    IsOptionalNumber(value.maxContains)
  )
}
/** Returns true if the given value is TAsyncIterator */
export function TAsyncIterator(value: unknown): value is TAsyncIterator {
  // prettier-ignore
  return (
    TKindOf(value, 'AsyncIterator') &&
    value.type === 'AsyncIterator' &&
    IsOptionalString(value.$id) &&
    TSchema(value.items)
  )
}
/** Returns true if the given value is TBigInt */
export function TBigInt(value: unknown): value is TBigInt {
  // prettier-ignore
  return (
    TKindOf(value, 'BigInt') &&
    value.type === 'bigint' &&
    IsOptionalString(value.$id) &&
    IsOptionalBigInt(value.exclusiveMaximum) &&
    IsOptionalBigInt(value.exclusiveMinimum) &&
    IsOptionalBigInt(value.maximum) &&
    IsOptionalBigInt(value.minimum) &&
    IsOptionalBigInt(value.multipleOf)
  )
}
/** Returns true if the given value is TBoolean */
export function TBoolean(value: unknown): value is TBoolean {
  // prettier-ignore
  return (
    TKindOf(value, 'Boolean') &&
    value.type === 'boolean' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TConstructor */
export function TConstructor(value: unknown): value is TConstructor {
  // prettier-ignore
  return (
    TKindOf(value, 'Constructor') &&
    value.type === 'Constructor' &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsArray(value.parameters) &&
    value.parameters.every(schema => TSchema(schema)) &&
    TSchema(value.returns)
  )
}
/** Returns true if the given value is TDate */
export function TDate(value: unknown): value is TDate {
  return (
    TKindOf(value, 'Date') &&
    value.type === 'Date' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.exclusiveMaximumTimestamp) &&
    IsOptionalNumber(value.exclusiveMinimumTimestamp) &&
    IsOptionalNumber(value.maximumTimestamp) &&
    IsOptionalNumber(value.minimumTimestamp) &&
    IsOptionalNumber(value.multipleOfTimestamp)
  )
}
/** Returns true if the given value is TFunction */
export function TFunction(value: unknown): value is TFunction {
  // prettier-ignore
  return (
    TKindOf(value, 'Function') &&
    value.type === 'Function' &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsArray(value.parameters) &&
    value.parameters.every(schema => TSchema(schema)) &&
    TSchema(value.returns)
  )
}
/** Returns true if the given value is TInteger */
export function TInteger(value: unknown): value is TInteger {
  return (
    TKindOf(value, 'Integer') &&
    value.type === 'integer' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.exclusiveMaximum) &&
    IsOptionalNumber(value.exclusiveMinimum) &&
    IsOptionalNumber(value.maximum) &&
    IsOptionalNumber(value.minimum) &&
    IsOptionalNumber(value.multipleOf)
  )
}
/** Returns true if the given schema is TProperties */
export function TProperties(value: unknown): value is TProperties {
  // prettier-ignore
  return (
    ValueGuard.IsObject(value) && 
    Object.entries(value).every(([key, schema]) => IsControlCharacterFree(key) && TSchema(schema))
  )
}
/** Returns true if the given value is TIntersect */
export function TIntersect(value: unknown): value is TIntersect {
  // prettier-ignore
  return (
    TKindOf(value, 'Intersect') &&
    (ValueGuard.IsString(value.type) && value.type !== 'object' ? false : true) &&
    ValueGuard.IsArray(value.allOf) &&
    value.allOf.every(schema => TSchema(schema) && !TTransform(schema)) &&
    IsOptionalString(value.type) &&
    (IsOptionalBoolean(value.unevaluatedProperties) || IsOptionalSchema(value.unevaluatedProperties)) &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TIterator */
export function TIterator(value: unknown): value is TIterator {
  // prettier-ignore
  return (
    TKindOf(value, 'Iterator') &&
    value.type === 'Iterator' &&
    IsOptionalString(value.$id) &&
    TSchema(value.items)
  )
}
/** Returns true if the given value is a TKind with the given name. */
export function TKindOf<T extends string>(value: unknown, kind: T): value is Record<PropertyKey, unknown> & { [Kind]: T } {
  return ValueGuard.IsObject(value) && Kind in value && value[Kind] === kind
}
/** Returns true if the given value is TLiteral<string> */
export function TLiteralString(value: unknown): value is TLiteral<string> {
  return TLiteral(value) && ValueGuard.IsString(value.const)
}
/** Returns true if the given value is TLiteral<number> */
export function TLiteralNumber(value: unknown): value is TLiteral<number> {
  return TLiteral(value) && ValueGuard.IsNumber(value.const)
}
/** Returns true if the given value is TLiteral<boolean> */
export function TLiteralBoolean(value: unknown): value is TLiteral<boolean> {
  return TLiteral(value) && ValueGuard.IsBoolean(value.const)
}
/** Returns true if the given value is TLiteral */
export function TLiteral(value: unknown): value is TLiteral {
  // prettier-ignore
  return (
    TKindOf(value, 'Literal') &&
    IsOptionalString(value.$id) && TLiteralValue(value.const)
  )
}
/** Returns true if the given value is a TLiteralValue */
export function TLiteralValue(value: unknown): value is TLiteralValue {
  return ValueGuard.IsBoolean(value) || ValueGuard.IsNumber(value) || ValueGuard.IsString(value)
}
/** Returns true if the given value is a TMappedKey */
export function TMappedKey(value: unknown): value is TMappedKey {
  // prettier-ignore
  return (
    TKindOf(value, 'MappedKey') &&
    ValueGuard.IsArray(value.keys) &&
    value.keys.every(key => ValueGuard.IsNumber(key) || ValueGuard.IsString(key))
  )
}
/** Returns true if the given value is TMappedResult */
export function TMappedResult(value: unknown): value is TMappedResult {
  // prettier-ignore
  return (
    TKindOf(value, 'MappedResult') && 
    TProperties(value.properties)
  )
}
/** Returns true if the given value is TNever */
export function TNever(value: unknown): value is TNever {
  // prettier-ignore
  return (
    TKindOf(value, 'Never') &&
    ValueGuard.IsObject(value.not) &&
    Object.getOwnPropertyNames(value.not).length === 0
  )
}
/** Returns true if the given value is TNot */
export function TNot(value: unknown): value is TNot {
  // prettier-ignore
  return (
    TKindOf(value, 'Not') &&
    TSchema(value.not)
  )
}
/** Returns true if the given value is TNull */
export function TNull(value: unknown): value is TNull {
  // prettier-ignore
  return (
    TKindOf(value, 'Null') &&
    value.type === 'null' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TNumber */
export function TNumber(value: unknown): value is TNumber {
  return (
    TKindOf(value, 'Number') &&
    value.type === 'number' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.exclusiveMaximum) &&
    IsOptionalNumber(value.exclusiveMinimum) &&
    IsOptionalNumber(value.maximum) &&
    IsOptionalNumber(value.minimum) &&
    IsOptionalNumber(value.multipleOf)
  )
}
/** Returns true if the given value is TObject */
export function TObject(value: unknown): value is TObject {
  // prettier-ignore
  return (
    TKindOf(value, 'Object') &&
    value.type === 'object' &&
    IsOptionalString(value.$id) &&
    TProperties(value.properties) &&
    IsAdditionalProperties(value.additionalProperties) &&
    IsOptionalNumber(value.minProperties) &&
    IsOptionalNumber(value.maxProperties)
  )
}
/** Returns true if the given value is TPromise */
export function TPromise(value: unknown): value is TPromise {
  // prettier-ignore
  return (
    TKindOf(value, 'Promise') &&
    value.type === 'Promise' &&
    IsOptionalString(value.$id) &&
    TSchema(value.item)
  )
}
/** Returns true if the given value is TRecord */
export function TRecord(value: unknown): value is TRecord {
  // prettier-ignore
  return (
    TKindOf(value, 'Record') &&
    value.type === 'object' &&
    IsOptionalString(value.$id) &&
    IsAdditionalProperties(value.additionalProperties) &&
    ValueGuard.IsObject(value.patternProperties) &&
    ((schema: Record<PropertyKey, unknown>) => {
      const keys = Object.getOwnPropertyNames(schema.patternProperties)
      return (
        keys.length === 1 &&
        IsPattern(keys[0]) &&
        ValueGuard.IsObject(schema.patternProperties) &&
        TSchema(schema.patternProperties[keys[0]])
      )
    })(value)
  )
}
/** Returns true if this value is TRecursive */
export function TRecursive(value: unknown): value is { [Hint]: 'Recursive' } {
  return ValueGuard.IsObject(value) && Hint in value && value[Hint] === 'Recursive'
}
/** Returns true if the given value is TRef */
export function TRef(value: unknown): value is TRef {
  // prettier-ignore
  return (
    TKindOf(value, 'Ref') &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsString(value.$ref)
  )
}
/** Returns true if the given value is TString */
export function TString(value: unknown): value is TString {
  // prettier-ignore
  return (
    TKindOf(value, 'String') &&
    value.type === 'string' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.minLength) &&
    IsOptionalNumber(value.maxLength) &&
    IsOptionalPattern(value.pattern) &&
    IsOptionalFormat(value.format)
  )
}
/** Returns true if the given value is TSymbol */
export function TSymbol(value: unknown): value is TSymbol {
  // prettier-ignore
  return (
    TKindOf(value, 'Symbol') &&
    value.type === 'symbol' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TTemplateLiteral */
export function TTemplateLiteral(value: unknown): value is TTemplateLiteral<TTemplateLiteralKind[]> {
  // prettier-ignore
  return (
    TKindOf(value, 'TemplateLiteral') &&
    value.type === 'string' &&
    ValueGuard.IsString(value.pattern) &&
    value.pattern[0] === '^' &&
    value.pattern[value.pattern.length - 1] === '$'
  )
}
/** Returns true if the given value is TThis */
export function TThis(value: unknown): value is TThis {
  // prettier-ignore
  return (
    TKindOf(value, 'This') &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsString(value.$ref)
  )
}
/** Returns true of this value is TTransform */
export function TTransform(value: unknown): value is { [TransformKind]: TransformOptions } {
  return ValueGuard.IsObject(value) && TransformKind in value
}
/** Returns true if the given value is TTuple */
export function TTuple(value: unknown): value is TTuple {
  // prettier-ignore
  return (
    TKindOf(value, 'Tuple') &&
    value.type === 'array' &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsNumber(value.minItems) &&
    ValueGuard.IsNumber(value.maxItems) &&
    value.minItems === value.maxItems &&
    (( // empty
      ValueGuard.IsUndefined(value.items) &&
      ValueGuard.IsUndefined(value.additionalItems) &&
      value.minItems === 0
    ) || (
        ValueGuard.IsArray(value.items) &&
        value.items.every(schema => TSchema(schema))
      ))
  )
}
/** Returns true if the given value is TUndefined */
export function TUndefined(value: unknown): value is TUndefined {
  // prettier-ignore
  return (
    TKindOf(value, 'Undefined') &&
    value.type === 'undefined' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TUnion<Literal<string | number>[]> */
export function TUnionLiteral(value: unknown): value is TUnion<TLiteral[]> {
  return TUnion(value) && value.anyOf.every((schema) => TLiteralString(schema) || TLiteralNumber(schema))
}
/** Returns true if the given value is TUnion */
export function TUnion(value: unknown): value is TUnion {
  // prettier-ignore
  return (
    TKindOf(value, 'Union') &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsObject(value) &&
    ValueGuard.IsArray(value.anyOf) &&
    value.anyOf.every(schema => TSchema(schema))
  )
}
/** Returns true if the given value is TUint8Array */
export function TUint8Array(value: unknown): value is TUint8Array {
  // prettier-ignore
  return (
    TKindOf(value, 'Uint8Array') &&
    value.type === 'Uint8Array' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.minByteLength) &&
    IsOptionalNumber(value.maxByteLength)
  )
}
/** Returns true if the given value is TUnknown */
export function TUnknown(value: unknown): value is TUnknown {
  // prettier-ignore
  return (
    TKindOf(value, 'Unknown') &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is a raw TUnsafe */
export function TUnsafe(value: unknown): value is TUnsafe<unknown> {
  return TKindOf(value, 'Unsafe')
}
/** Returns true if the given value is TVoid */
export function TVoid(value: unknown): value is TVoid {
  // prettier-ignore
  return (
    TKindOf(value, 'Void') &&
    value.type === 'void' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TKind */
export function TKind(value: unknown): value is Record<PropertyKey, unknown> & { [Kind]: string } {
  return ValueGuard.IsObject(value) && Kind in value && ValueGuard.IsString(value[Kind]) && !KnownTypes.includes(value[Kind] as string)
}
/** Returns true if the given value is TSchema */
export function TSchema(value: unknown): value is TSchema {
  // prettier-ignore
  return (
    ValueGuard.IsObject(value)
  ) && (
      TAny(value) ||
      TArray(value) ||
      TBoolean(value) ||
      TBigInt(value) ||
      TAsyncIterator(value) ||
      TConstructor(value) ||
      TDate(value) ||
      TFunction(value) ||
      TInteger(value) ||
      TIntersect(value) ||
      TIterator(value) ||
      TLiteral(value) ||
      TMappedKey(value) ||
      TMappedResult(value) ||
      TNever(value) ||
      TNot(value) ||
      TNull(value) ||
      TNumber(value) ||
      TObject(value) ||
      TPromise(value) ||
      TRecord(value) ||
      TRef(value) ||
      TString(value) ||
      TSymbol(value) ||
      TTemplateLiteral(value) ||
      TThis(value) ||
      TTuple(value) ||
      TUndefined(value) ||
      TUnion(value) ||
      TUint8Array(value) ||
      TUnknown(value) ||
      TUnsafe(value) ||
      TVoid(value) ||
      TKind(value)
    )
}
