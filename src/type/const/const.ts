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

import type { AssertRest, Evaluate } from '../helpers/index'
import type { TSchema, SchemaOptions } from '../schema/index'
import type { TProperties } from '../object/index'

import { Any, type TAny } from '../any/index'
import { BigInt, type TBigInt } from '../bigint/index'
import { Date, type TDate } from '../date/index'
import { Function as FunctionType, type TFunction } from '../function/index'
import { Literal, type TLiteral } from '../literal/index'
import { type TNever } from '../never/index'
import { Null, type TNull } from '../null/index'
import { Object, type TObject } from '../object/index'
import { Symbol, type TSymbol } from '../symbol/index'
import { Tuple, type TTuple } from '../tuple/index'
import { Readonly, type TReadonly } from '../readonly/index'
import { Undefined, type TUndefined } from '../undefined/index'
import { Uint8Array, type TUint8Array } from '../uint8array/index'
import { Unknown, type TUnknown } from '../unknown/index'
import { CloneType } from '../clone/index'

// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsArray, IsNumber, IsBigInt, IsUint8Array, IsDate, IsIterator, IsObject, IsAsyncIterator, IsFunction, IsUndefined, IsNull, IsSymbol, IsBoolean, IsString } from '../guard/value'
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<T extends readonly unknown[]> = 
  T extends readonly [infer L extends unknown, ...infer R extends unknown[]] 
    ? [FromValue<L, false>, ...TFromArray<R>] 
    : T
// prettier-ignore
function FromArray<T extends readonly unknown[]>(T: [...T]): TFromArray<T> {
  return T.map(L => FromValue(L, false)) as never
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<T extends Record<PropertyKey, unknown>> = {
  -readonly [K in keyof T]: FromValue<T[K], false> extends infer R extends TSchema 
    ? TReadonly<R>
    : TReadonly<TNever>
}
// prettier-ignore
function FromProperties<T extends Record<PropertyKey, unknown>>(value: T): TFromProperties<T> {
  const Acc = {} as TProperties
  for(const K of globalThis.Object.getOwnPropertyNames(value)) Acc[K] = Readonly(FromValue(value[K], false))
  return Acc as never
}
// ------------------------------------------------------------------
// ConditionalReadonly - Only applied if not root
// ------------------------------------------------------------------
type TConditionalReadonly<T extends TSchema, Root extends boolean> = Root extends true ? T : TReadonly<T>
function ConditionalReadonly<T extends TSchema, Root extends boolean>(T: T, root: Root): TConditionalReadonly<T, Root> {
  return (root === true ? T : Readonly(T)) as never
}
// ------------------------------------------------------------------
// FromValue
// ------------------------------------------------------------------
// prettier-ignore
type FromValue<T, Root extends boolean> = 
  T extends AsyncIterableIterator<unknown> ? TConditionalReadonly<TAny, Root> : 
  T extends IterableIterator<unknown> ? TConditionalReadonly<TAny, Root> : 
  T extends readonly unknown[] ? TReadonly<TTuple<AssertRest<TFromArray<T>>>> :
  T extends Uint8Array ? TUint8Array :
  T extends Date ? TDate :
  T extends Record<PropertyKey, unknown> ? TConditionalReadonly<TObject<Evaluate<TFromProperties<T>>>, Root> :
  T extends Function ? TConditionalReadonly<TFunction<[], TUnknown>, Root> : 
  T extends undefined ? TUndefined :
  T extends null ? TNull :
  T extends symbol ? TSymbol :
  T extends number ? TLiteral<T> : 
  T extends boolean ? TLiteral<T> :
  T extends string ? TLiteral<T> : 
  T extends bigint ? TBigInt : 
  TObject<{}>
// prettier-ignore
function FromValue<T, Root extends boolean>(value: T, root: Root): FromValue<T, Root> {
  return (
    IsAsyncIterator(value) ? ConditionalReadonly(Any(), root) :
    IsIterator(value) ? ConditionalReadonly(Any(), root) :
    IsArray(value) ? Readonly(Tuple(FromArray(value) as TSchema[])) :
    IsUint8Array(value) ? Uint8Array() :
    IsDate(value) ?  Date() :
    IsObject(value) ? ConditionalReadonly(Object(FromProperties(value as Record<PropertyKey, unknown>) as TProperties), root) :
    IsFunction(value) ? ConditionalReadonly(FunctionType([], Unknown()), root) :
    IsUndefined(value) ? Undefined() :
    IsNull(value) ? Null() :
    IsSymbol(value) ? Symbol() :
    IsBigInt(value) ? BigInt() :
    IsNumber(value) ? Literal(value) :
    IsBoolean(value) ? Literal(value) :
    IsString(value) ? Literal(value) :
    Object({})
  ) as never
}
// ------------------------------------------------------------------
// TConst
// ------------------------------------------------------------------
export type TConst<T> = FromValue<T, true>

/** `[JavaScript]` Creates a readonly const type from the given value. */
export function Const</* const (not supported in 4.0) */ T>(T: T, options: SchemaOptions = {}): TConst<T> {
  return CloneType(FromValue(T, true), options) as never
}
