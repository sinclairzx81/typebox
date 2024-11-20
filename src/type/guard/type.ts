/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import { TypeBoxError } from '../error/index'
import { TransformOptions } from '../transform/index'
import type { TTemplateLiteral } from '../template-literal/index'
import type { TArray } from '../array/index'
import type { TBoolean } from '../boolean/index'
import type { TComputed } from '../computed/index'
import type { TRecord } from '../record/index'
import type { TString } from '../string/index'
import type { TUnion } from '../union/index'
import type { TAny } from '../any/index'
import type { TAsyncIterator } from '../async-iterator/index'
import type { TBigInt } from '../bigint/index'
import type { TConstructor } from '../constructor/index'
import type { TFunction } from '../function/index'
import type { TImport } from '../module/index'
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
import type { TRegExp } from '../regexp/index'
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

export class TypeGuardUnknownTypeError extends TypeBoxError {}

const KnownTypes = [
  'Any',
  'Array',
  'AsyncIterator',
  'BigInt',
  'Boolean',
  'Computed',
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
  'RegExp',
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
  return IsOptionalBoolean(value) || IsSchema(value)
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
  return ValueGuard.IsUndefined(value) || IsSchema(value)
}
// ------------------------------------------------------------------
// Modifiers
// ------------------------------------------------------------------
/** Returns true if this value has a Readonly symbol */
export function IsReadonly<T extends TSchema>(value: T): value is TReadonly<T> {
  return ValueGuard.IsObject(value) && value[ReadonlyKind] === 'Readonly'
}
/** Returns true if this value has a Optional symbol */
export function IsOptional<T extends TSchema>(value: T): value is TOptional<T> {
  return ValueGuard.IsObject(value) && value[OptionalKind] === 'Optional'
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
/** Returns true if the given value is TAny */
export function IsAny(value: unknown): value is TAny {
  // prettier-ignore
  return (
    IsKindOf(value, 'Any') &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TArray */
export function IsArray(value: unknown): value is TArray {
  return (
    IsKindOf(value, 'Array') &&
    value.type === 'array' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.items) &&
    IsOptionalNumber(value.minItems) &&
    IsOptionalNumber(value.maxItems) &&
    IsOptionalBoolean(value.uniqueItems) &&
    IsOptionalSchema(value.contains) &&
    IsOptionalNumber(value.minContains) &&
    IsOptionalNumber(value.maxContains)
  )
}
/** Returns true if the given value is TAsyncIterator */
export function IsAsyncIterator(value: unknown): value is TAsyncIterator {
  // prettier-ignore
  return (
    IsKindOf(value, 'AsyncIterator') &&
    value.type === 'AsyncIterator' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.items)
  )
}
/** Returns true if the given value is TBigInt */
export function IsBigInt(value: unknown): value is TBigInt {
  // prettier-ignore
  return (
    IsKindOf(value, 'BigInt') &&
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
export function IsBoolean(value: unknown): value is TBoolean {
  // prettier-ignore
  return (
    IsKindOf(value, 'Boolean') &&
    value.type === 'boolean' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TComputed */
export function IsComputed(value: unknown): value is TComputed {
  // prettier-ignore
  return (
    IsKindOf(value, 'Computed') && 
    ValueGuard.IsString(value.target) && 
    ValueGuard.IsArray(value.parameters) && 
    value.parameters.every((schema) => IsSchema(schema))
  )
}
/** Returns true if the given value is TConstructor */
export function IsConstructor(value: unknown): value is TConstructor {
  // prettier-ignore
  return (
    IsKindOf(value, 'Constructor') &&
    value.type === 'Constructor' &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsArray(value.parameters) &&
    value.parameters.every(schema => IsSchema(schema)) &&
    IsSchema(value.returns)
  )
}
/** Returns true if the given value is TDate */
export function IsDate(value: unknown): value is TDate {
  return (
    IsKindOf(value, 'Date') &&
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
export function IsFunction(value: unknown): value is TFunction {
  // prettier-ignore
  return (
    IsKindOf(value, 'Function') &&
    value.type === 'Function' &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsArray(value.parameters) &&
    value.parameters.every(schema => IsSchema(schema)) &&
    IsSchema(value.returns)
  )
}
/** Returns true if the given value is TImport */
export function IsImport(value: unknown): value is TImport {
  // prettier-ignore
  return (
    IsKindOf(value, 'Import') &&
    ValueGuard.HasPropertyKey(value, '$defs') &&
    ValueGuard.IsObject(value.$defs) &&
    IsProperties(value.$defs) &&
    ValueGuard.HasPropertyKey(value, '$ref') &&
    ValueGuard.IsString(value.$ref) &&
    value.$ref in value.$defs // required
  )
}
/** Returns true if the given value is TInteger */
export function IsInteger(value: unknown): value is TInteger {
  return (
    IsKindOf(value, 'Integer') &&
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
export function IsProperties(value: unknown): value is TProperties {
  // prettier-ignore
  return (
    ValueGuard.IsObject(value) && 
    Object.entries(value).every(([key, schema]) => IsControlCharacterFree(key) && IsSchema(schema))
  )
}
/** Returns true if the given value is TIntersect */
export function IsIntersect(value: unknown): value is TIntersect {
  // prettier-ignore
  return (
    IsKindOf(value, 'Intersect') &&
    (ValueGuard.IsString(value.type) && value.type !== 'object' ? false : true) &&
    ValueGuard.IsArray(value.allOf) &&
    value.allOf.every(schema => IsSchema(schema) && !IsTransform(schema)) &&
    IsOptionalString(value.type) &&
    (IsOptionalBoolean(value.unevaluatedProperties) || IsOptionalSchema(value.unevaluatedProperties)) &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TIterator */
export function IsIterator(value: unknown): value is TIterator {
  // prettier-ignore
  return (
    IsKindOf(value, 'Iterator') &&
    value.type === 'Iterator' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.items)
  )
}
/** Returns true if the given value is a TKind with the given name. */
export function IsKindOf<T extends string>(value: unknown, kind: T): value is Record<PropertyKey, unknown> & { [Kind]: T } {
  return ValueGuard.IsObject(value) && Kind in value && value[Kind] === kind
}
/** Returns true if the given value is TLiteral<string> */
export function IsLiteralString(value: unknown): value is TLiteral<string> {
  return IsLiteral(value) && ValueGuard.IsString(value.const)
}
/** Returns true if the given value is TLiteral<number> */
export function IsLiteralNumber(value: unknown): value is TLiteral<number> {
  return IsLiteral(value) && ValueGuard.IsNumber(value.const)
}
/** Returns true if the given value is TLiteral<boolean> */
export function IsLiteralBoolean(value: unknown): value is TLiteral<boolean> {
  return IsLiteral(value) && ValueGuard.IsBoolean(value.const)
}
/** Returns true if the given value is TLiteral */
export function IsLiteral(value: unknown): value is TLiteral {
  // prettier-ignore
  return (
    IsKindOf(value, 'Literal') &&
    IsOptionalString(value.$id) && IsLiteralValue(value.const)
  )
}
/** Returns true if the given value is a TLiteralValue */
export function IsLiteralValue(value: unknown): value is TLiteralValue {
  return ValueGuard.IsBoolean(value) || ValueGuard.IsNumber(value) || ValueGuard.IsString(value)
}
/** Returns true if the given value is a TMappedKey */
export function IsMappedKey(value: unknown): value is TMappedKey {
  // prettier-ignore
  return (
    IsKindOf(value, 'MappedKey') &&
    ValueGuard.IsArray(value.keys) &&
    value.keys.every(key => ValueGuard.IsNumber(key) || ValueGuard.IsString(key))
  )
}
/** Returns true if the given value is TMappedResult */
export function IsMappedResult(value: unknown): value is TMappedResult {
  // prettier-ignore
  return (
    IsKindOf(value, 'MappedResult') && 
    IsProperties(value.properties)
  )
}
/** Returns true if the given value is TNever */
export function IsNever(value: unknown): value is TNever {
  // prettier-ignore
  return (
    IsKindOf(value, 'Never') &&
    ValueGuard.IsObject(value.not) &&
    Object.getOwnPropertyNames(value.not).length === 0
  )
}
/** Returns true if the given value is TNot */
export function IsNot(value: unknown): value is TNot {
  // prettier-ignore
  return (
    IsKindOf(value, 'Not') &&
    IsSchema(value.not)
  )
}
/** Returns true if the given value is TNull */
export function IsNull(value: unknown): value is TNull {
  // prettier-ignore
  return (
    IsKindOf(value, 'Null') &&
    value.type === 'null' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TNumber */
export function IsNumber(value: unknown): value is TNumber {
  return (
    IsKindOf(value, 'Number') &&
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
export function IsObject(value: unknown): value is TObject {
  // prettier-ignore
  return (
    IsKindOf(value, 'Object') &&
    value.type === 'object' &&
    IsOptionalString(value.$id) &&
    IsProperties(value.properties) &&
    IsAdditionalProperties(value.additionalProperties) &&
    IsOptionalNumber(value.minProperties) &&
    IsOptionalNumber(value.maxProperties)
  )
}
/** Returns true if the given value is TPromise */
export function IsPromise(value: unknown): value is TPromise {
  // prettier-ignore
  return (
    IsKindOf(value, 'Promise') &&
    value.type === 'Promise' &&
    IsOptionalString(value.$id) &&
    IsSchema(value.item)
  )
}
/** Returns true if the given value is TRecord */
export function IsRecord(value: unknown): value is TRecord {
  // prettier-ignore
  return (
    IsKindOf(value, 'Record') &&
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
        IsSchema(schema.patternProperties[keys[0]])
      )
    })(value)
  )
}
/** Returns true if this value is TRecursive */
export function IsRecursive(value: unknown): value is { [Hint]: 'Recursive' } {
  return ValueGuard.IsObject(value) && Hint in value && value[Hint] === 'Recursive'
}
/** Returns true if the given value is TRef */
export function IsRef(value: unknown): value is TRef {
  // prettier-ignore
  return (
    IsKindOf(value, 'Ref') &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsString(value.$ref)
  )
}
/** Returns true if the given value is TRegExp */
export function IsRegExp(value: unknown): value is TRegExp {
  // prettier-ignore
  return (
    IsKindOf(value, 'RegExp') &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsString(value.source) &&
    ValueGuard.IsString(value.flags) &&
    IsOptionalNumber(value.maxLength) &&
    IsOptionalNumber(value.minLength)
  )
}
/** Returns true if the given value is TString */
export function IsString(value: unknown): value is TString {
  // prettier-ignore
  return (
    IsKindOf(value, 'String') &&
    value.type === 'string' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.minLength) &&
    IsOptionalNumber(value.maxLength) &&
    IsOptionalPattern(value.pattern) &&
    IsOptionalFormat(value.format)
  )
}
/** Returns true if the given value is TSymbol */
export function IsSymbol(value: unknown): value is TSymbol {
  // prettier-ignore
  return (
    IsKindOf(value, 'Symbol') &&
    value.type === 'symbol' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TTemplateLiteral */
export function IsTemplateLiteral(value: unknown): value is TTemplateLiteral {
  // prettier-ignore
  return (
    IsKindOf(value, 'TemplateLiteral') &&
    value.type === 'string' &&
    ValueGuard.IsString(value.pattern) &&
    value.pattern[0] === '^' &&
    value.pattern[value.pattern.length - 1] === '$'
  )
}
/** Returns true if the given value is TThis */
export function IsThis(value: unknown): value is TThis {
  // prettier-ignore
  return (
    IsKindOf(value, 'This') &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsString(value.$ref)
  )
}
/** Returns true of this value is TTransform */
export function IsTransform(value: unknown): value is { [TransformKind]: TransformOptions } {
  return ValueGuard.IsObject(value) && TransformKind in value
}
/** Returns true if the given value is TTuple */
export function IsTuple(value: unknown): value is TTuple {
  // prettier-ignore
  return (
    IsKindOf(value, 'Tuple') &&
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
        value.items.every(schema => IsSchema(schema))
      ))
  )
}
/** Returns true if the given value is TUndefined */
export function IsUndefined(value: unknown): value is TUndefined {
  // prettier-ignore
  return (
    IsKindOf(value, 'Undefined') &&
    value.type === 'undefined' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TUnion<Literal<string | number>[]> */
export function IsUnionLiteral(value: unknown): value is TUnion<TLiteral[]> {
  return IsUnion(value) && value.anyOf.every((schema) => IsLiteralString(schema) || IsLiteralNumber(schema))
}
/** Returns true if the given value is TUnion */
export function IsUnion(value: unknown): value is TUnion {
  // prettier-ignore
  return (
    IsKindOf(value, 'Union') &&
    IsOptionalString(value.$id) &&
    ValueGuard.IsObject(value) &&
    ValueGuard.IsArray(value.anyOf) &&
    value.anyOf.every(schema => IsSchema(schema))
  )
}
/** Returns true if the given value is TUint8Array */
export function IsUint8Array(value: unknown): value is TUint8Array {
  // prettier-ignore
  return (
    IsKindOf(value, 'Uint8Array') &&
    value.type === 'Uint8Array' &&
    IsOptionalString(value.$id) &&
    IsOptionalNumber(value.minByteLength) &&
    IsOptionalNumber(value.maxByteLength)
  )
}
/** Returns true if the given value is TUnknown */
export function IsUnknown(value: unknown): value is TUnknown {
  // prettier-ignore
  return (
    IsKindOf(value, 'Unknown') &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is a raw TUnsafe */
export function IsUnsafe(value: unknown): value is TUnsafe<unknown> {
  return IsKindOf(value, 'Unsafe')
}
/** Returns true if the given value is TVoid */
export function IsVoid(value: unknown): value is TVoid {
  // prettier-ignore
  return (
    IsKindOf(value, 'Void') &&
    value.type === 'void' &&
    IsOptionalString(value.$id)
  )
}
/** Returns true if the given value is TKind */
export function IsKind(value: unknown): value is Record<PropertyKey, unknown> & { [Kind]: string } {
  return ValueGuard.IsObject(value) && Kind in value && ValueGuard.IsString(value[Kind]) && !KnownTypes.includes(value[Kind] as string)
}
/** Returns true if the given value is TSchema */
export function IsSchema(value: unknown): value is TSchema {
  // prettier-ignore
  return (
    ValueGuard.IsObject(value)
  ) && (
      IsAny(value) ||
      IsArray(value) ||
      IsBoolean(value) ||
      IsBigInt(value) ||
      IsAsyncIterator(value) ||
      IsComputed(value) ||
      IsConstructor(value) ||
      IsDate(value) ||
      IsFunction(value) ||
      IsInteger(value) ||
      IsIntersect(value) ||
      IsIterator(value) ||
      IsLiteral(value) ||
      IsMappedKey(value) ||
      IsMappedResult(value) ||
      IsNever(value) ||
      IsNot(value) ||
      IsNull(value) ||
      IsNumber(value) ||
      IsObject(value) ||
      IsPromise(value) ||
      IsRecord(value) ||
      IsRef(value) ||
      IsRegExp(value) ||
      IsString(value) ||
      IsSymbol(value) ||
      IsTemplateLiteral(value) ||
      IsThis(value) ||
      IsTuple(value) ||
      IsUndefined(value) ||
      IsUnion(value) ||
      IsUint8Array(value) ||
      IsUnknown(value) ||
      IsUnsafe(value) ||
      IsVoid(value) ||
      IsKind(value)
    )
}
