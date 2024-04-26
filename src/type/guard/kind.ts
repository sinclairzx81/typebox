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
import { TransformOptions } from '../transform/index'
import { TTemplateLiteral } from '../template-literal/index'
import { TArray } from '../array/index'
import { TBoolean } from '../boolean/index'
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
import type { TLiteral } from '../literal/index'
import type { TMappedKey, TMappedResult } from '../mapped/index'
import type { TNever } from '../never/index'
import type { TNot } from '../not/index'
import type { TNull } from '../null/index'
import type { TNumber } from '../number/index'
import type { TObject, TProperties } from '../object/index'
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

/** `[Kind-Only]` Returns true if this value has a Readonly symbol */
export function IsReadonly<T extends TSchema>(value: T): value is TReadonly<T> {
  return ValueGuard.IsObject(value) && value[ReadonlyKind] === 'Readonly'
}
/** `[Kind-Only]` Returns true if this value has a Optional symbol */
export function IsOptional<T extends TSchema>(value: T): value is TOptional<T> {
  return ValueGuard.IsObject(value) && value[OptionalKind] === 'Optional'
}
/** `[Kind-Only]` Returns true if the given value is TAny */
export function IsAny(value: unknown): value is TAny {
  return IsKindOf(value, 'Any')
}
/** `[Kind-Only]` Returns true if the given value is TArray */
export function IsArray(value: unknown): value is TArray {
  return IsKindOf(value, 'Array')
}
/** `[Kind-Only]` Returns true if the given value is TAsyncIterator */
export function IsAsyncIterator(value: unknown): value is TAsyncIterator {
  return IsKindOf(value, 'AsyncIterator')
}
/** `[Kind-Only]` Returns true if the given value is TBigInt */
export function IsBigInt(value: unknown): value is TBigInt {
  return IsKindOf(value, 'BigInt')
}
/** `[Kind-Only]` Returns true if the given value is TBoolean */
export function IsBoolean(value: unknown): value is TBoolean {
  return IsKindOf(value, 'Boolean')
}
/** `[Kind-Only]` Returns true if the given value is TConstructor */
export function IsConstructor(value: unknown): value is TConstructor {
  return IsKindOf(value, 'Constructor')
}
/** `[Kind-Only]` Returns true if the given value is TDate */
export function IsDate(value: unknown): value is TDate {
  return IsKindOf(value, 'Date')
}
/** `[Kind-Only]` Returns true if the given value is TFunction */
export function IsFunction(value: unknown): value is TFunction {
  return IsKindOf(value, 'Function')
}
/** `[Kind-Only]` Returns true if the given value is TInteger */
export function IsInteger(value: unknown): value is TInteger {
  return IsKindOf(value, 'Integer')
}
/** `[Kind-Only]` Returns true if the given schema is TProperties */
export function IsProperties(value: unknown): value is TProperties {
  return ValueGuard.IsObject(value)
}
/** `[Kind-Only]` Returns true if the given value is TIntersect */
export function IsIntersect(value: unknown): value is TIntersect {
  return IsKindOf(value, 'Intersect')
}
/** `[Kind-Only]` Returns true if the given value is TIterator */
export function IsIterator(value: unknown): value is TIterator {
  return IsKindOf(value, 'Iterator')
}
/** `[Kind-Only]` Returns true if the given value is a TKind with the given name. */
export function IsKindOf<T extends string>(value: unknown, kind: T): value is Record<PropertyKey, unknown> & { [Kind]: T } {
  return ValueGuard.IsObject(value) && Kind in value && value[Kind] === kind
}
/** `[Kind-Only]` Returns true if the given value is TLiteral<string> */
export function IsLiteralString(value: unknown): value is TLiteral<string> {
  return IsLiteral(value) && ValueGuard.IsString(value.const)
}
/** `[Kind-Only]` Returns true if the given value is TLiteral<number> */
export function IsLiteralNumber(value: unknown): value is TLiteral<number> {
  return IsLiteral(value) && ValueGuard.IsNumber(value.const)
}
/** `[Kind-Only]` Returns true if the given value is TLiteral<boolean> */
export function IsLiteralBoolean(value: unknown): value is TLiteral<boolean> {
  return IsLiteral(value) && ValueGuard.IsBoolean(value.const)
}
/** `[Kind-Only]` Returns true if the given value is TLiteral */
export function IsLiteral(value: unknown): value is TLiteral {
  return IsKindOf(value, 'Literal')
}
/** `[Kind-Only]` Returns true if the given value is a TMappedKey */
export function IsMappedKey(value: unknown): value is TMappedKey {
  return IsKindOf(value, 'MappedKey')
}
/** `[Kind-Only]` Returns true if the given value is TMappedResult */
export function IsMappedResult(value: unknown): value is TMappedResult {
  return IsKindOf(value, 'MappedResult')
}
/** `[Kind-Only]` Returns true if the given value is TNever */
export function IsNever(value: unknown): value is TNever {
  return IsKindOf(value, 'Never')
}
/** `[Kind-Only]` Returns true if the given value is TNot */
export function IsNot(value: unknown): value is TNot {
  return IsKindOf(value, 'Not')
}
/** `[Kind-Only]` Returns true if the given value is TNull */
export function IsNull(value: unknown): value is TNull {
  return IsKindOf(value, 'Null')
}
/** `[Kind-Only]` Returns true if the given value is TNumber */
export function IsNumber(value: unknown): value is TNumber {
  return IsKindOf(value, 'Number')
}
/** `[Kind-Only]` Returns true if the given value is TObject */
export function IsObject(value: unknown): value is TObject {
  return IsKindOf(value, 'Object')
}
/** `[Kind-Only]` Returns true if the given value is TPromise */
export function IsPromise(value: unknown): value is TPromise {
  return IsKindOf(value, 'Promise')
}
/** `[Kind-Only]` Returns true if the given value is TRecord */
export function IsRecord(value: unknown): value is TRecord {
  return IsKindOf(value, 'Record')
}
/** `[Kind-Only]` Returns true if this value is TRecursive */
export function IsRecursive(value: unknown): value is { [Hint]: 'Recursive' } {
  return ValueGuard.IsObject(value) && Hint in value && value[Hint] === 'Recursive'
}
/** `[Kind-Only]` Returns true if the given value is TRef */
export function IsRef(value: unknown): value is TRef {
  return IsKindOf(value, 'Ref')
}
/** `[Kind-Only]` Returns true if the given value is TRegExp */
export function IsRegExp(value: unknown): value is TRegExp {
  return IsKindOf(value, 'RegExp')
}
/** `[Kind-Only]` Returns true if the given value is TString */
export function IsString(value: unknown): value is TString {
  return IsKindOf(value, 'String')
}
/** `[Kind-Only]` Returns true if the given value is TSymbol */
export function IsSymbol(value: unknown): value is TSymbol {
  return IsKindOf(value, 'Symbol')
}
/** `[Kind-Only]` Returns true if the given value is TTemplateLiteral */
export function IsTemplateLiteral(value: unknown): value is TTemplateLiteral {
  return IsKindOf(value, 'TemplateLiteral')
}
/** `[Kind-Only]` Returns true if the given value is TThis */
export function IsThis(value: unknown): value is TThis {
  return IsKindOf(value, 'This')
}
/** `[Kind-Only]` Returns true of this value is TTransform */
export function IsTransform(value: unknown): value is { [TransformKind]: TransformOptions } {
  return ValueGuard.IsObject(value) && TransformKind in value
}
/** `[Kind-Only]` Returns true if the given value is TTuple */
export function IsTuple(value: unknown): value is TTuple {
  return IsKindOf(value, 'Tuple')
}
/** `[Kind-Only]` Returns true if the given value is TUndefined */
export function IsUndefined(value: unknown): value is TUndefined {
  return IsKindOf(value, 'Undefined')
}
/** `[Kind-Only]` Returns true if the given value is TUnion */
export function IsUnion(value: unknown): value is TUnion {
  return IsKindOf(value, 'Union')
}
/** `[Kind-Only]` Returns true if the given value is TUint8Array */
export function IsUint8Array(value: unknown): value is TUint8Array {
  return IsKindOf(value, 'Uint8Array')
}
/** `[Kind-Only]` Returns true if the given value is TUnknown */
export function IsUnknown(value: unknown): value is TUnknown {
  return IsKindOf(value, 'Unknown')
}
/** `[Kind-Only]` Returns true if the given value is a raw TUnsafe */
export function IsUnsafe(value: unknown): value is TUnsafe<unknown> {
  return IsKindOf(value, 'Unsafe')
}
/** `[Kind-Only]` Returns true if the given value is TVoid */
export function IsVoid(value: unknown): value is TVoid {
  return IsKindOf(value, 'Void')
}
/** `[Kind-Only]` Returns true if the given value is TKind */
export function IsKind(value: unknown): value is Record<PropertyKey, unknown> & { [Kind]: string } {
  return ValueGuard.IsObject(value) && Kind in value && ValueGuard.IsString(value[Kind])
}
/** `[Kind-Only]` Returns true if the given value is TSchema */
export function IsSchema(value: unknown): value is TSchema {
  // prettier-ignore
  return (
    IsAny(value) ||
    IsArray(value) ||
    IsBoolean(value) ||
    IsBigInt(value) ||
    IsAsyncIterator(value) ||
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
