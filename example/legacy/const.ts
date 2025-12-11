/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

import { Memory } from 'typebox/system'
import Type from 'typebox'
import Guard from 'typebox/guard'

// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
type TFromArray<Types extends readonly unknown[], Result extends Type.TSchema[] = []> = 
  Types extends readonly [infer L extends unknown, ...infer R extends unknown[]] 
    ? TFromArray<R, [...Result, FromValue<L, false>]> 
    : Result

function FromArray<Types extends readonly unknown[]>(T: [...Types]): TFromArray<Types> {
  return T.map(L => FromValue(L, false)) as never
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
type TFromProperties<Properties extends Record<PropertyKey, unknown>,
  Result extends Type.TProperties = {
    -readonly [K in keyof Properties]: FromValue<Properties[K], false> extends infer R extends Type.TSchema 
      ? Type.TReadonly<R>
      : Type.TReadonly<Type.TNever>
  }
> = Result
function FromProperties<Properties extends Record<PropertyKey, unknown>>(value: Properties): TFromProperties<Properties> {
  const Acc = {} as Type.TProperties
  for(const K of globalThis.Object.getOwnPropertyNames(value)) Acc[K] = Type.Readonly(FromValue(value[K], false))
  return Acc as never
}
// ------------------------------------------------------------------
// ConditionalReadonly - Only applied if not root
// ------------------------------------------------------------------
type TConditionalReadonly<Type extends Type.TSchema, Root extends boolean,
  Result extends Type.TSchema = Root extends true ? Type : Type.TReadonly<Type>
> = Result
function ConditionalReadonly<Type extends Type.TSchema, Root extends boolean>(T: Type, root: Root): TConditionalReadonly<Type, Root> {
  return (root === true ? T : Type.Readonly(T)) as never
}
// ------------------------------------------------------------------
// FromValue
// ------------------------------------------------------------------
type FromValue<Value, Root extends boolean> = 
  Value extends AsyncIterableIterator<unknown> ? TConditionalReadonly<Type.TAny, Root> : 
  Value extends IterableIterator<unknown> ? TConditionalReadonly<Type.TAny, Root> : 
  Value extends readonly unknown[] ? Type.TReadonly<Type.TTuple<TFromArray<Value>>> :
  Value extends Record<PropertyKey, unknown> ? TConditionalReadonly<Type.TObject<TFromProperties<Value>>, Root> :
  Value extends Function ? TConditionalReadonly<Type.TFunction<[], Type.TUnknown>, Root> : 
  Value extends undefined ? Type.TUndefined :
  Value extends null ? Type.TNull :
  Value extends symbol ? Type.TSymbol :
  Value extends number ? Type.TLiteral<Value> : 
  Value extends boolean ? Type.TLiteral<Value> :
  Value extends string ? Type.TLiteral<Value> : 
  Value extends bigint ? Type.TBigInt : 
  Type.TObject<{}>

function FromValue<Value, Root extends boolean>(value: Value, root: Root): FromValue<Value, Root> {
  return (
    Guard.IsAsyncIterator(value) ? ConditionalReadonly(Type.Any(), root) :
    Guard.IsIterator(value) ? ConditionalReadonly(Type.Any(), root) :
    Guard.IsArray(value) ? Type.Readonly(Type.Tuple(FromArray(value))) :
    Guard.IsObject(value) ? ConditionalReadonly(Type.Object(FromProperties(value)), root) :
    Guard.IsFunction(value) ? ConditionalReadonly(Type.Function([], Type.Unknown()), root) :
    Guard.IsUndefined(value) ? Type.Undefined() :
    Guard.IsNull(value) ? Type.Null() :
    Guard.IsSymbol(value) ? Type.Symbol() :
    Guard.IsBigInt(value) ? Type.BigInt() :
    Guard.IsNumber(value) ? Type.Literal(value) :
    Guard.IsBoolean(value) ? Type.Literal(value) :
    Guard.IsString(value) ? Type.Literal(value) :
    Type.Object({})
  ) as never
}
// ------------------------------------------------------------------
// TConst
// ------------------------------------------------------------------
export type TConst<T> = FromValue<T, true>

/** Creates a readonly const type from the given value. */
export function Const<const T>(T: T, options: Type.TSchemaOptions = {}): TConst<T> {
  const result = FromValue(T, true)
  return Memory.Update(result, {}, options) as never
}