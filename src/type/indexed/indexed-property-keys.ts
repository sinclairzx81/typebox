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

import { TemplateLiteralGenerate, type TTemplateLiteralGenerate, type TTemplateLiteral } from '../template-literal/index'
import type { TLiteral, TLiteralValue } from '../literal/index'
import type { TInteger } from '../integer/index'
import type { TNumber } from '../number/index'
import type { TSchema } from '../schema/index'
import type { TUnion } from '../union/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsTemplateLiteral, IsUnion, IsLiteral, IsNumber, IsInteger } from '../guard/kind'
// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteral<T extends TTemplateLiteral, R extends string[] = TTemplateLiteralGenerate<T>> = (R)
// prettier-ignore
function FromTemplateLiteral<T extends TTemplateLiteral>(T: T): TFromTemplateLiteral<T> {
  const R = TemplateLiteralGenerate(T) as string[]
  return R.map(S => S.toString()) as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<T extends TSchema[], Acc extends string[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? TFromUnion<R, [...Acc, ...TIndexPropertyKeys<L>]>
    : Acc
)
// prettier-ignore
function FromUnion<T extends TSchema[]>(T: T): TFromUnion<T> {
  const Acc = [] as string[]
  for(const L of T) Acc.push(...IndexPropertyKeys(L))
  return Acc as never
}
// ------------------------------------------------------------------
// FromLiteral
// ------------------------------------------------------------------
// prettier-ignore
type TFromLiteral<T extends TLiteralValue> = (
  T extends PropertyKey 
    ? [`${T}`] 
    : []
)
// prettier-ignore
function FromLiteral<T extends TLiteralValue>(T: T): TFromLiteral<T> {
  return (
    [(T as string).toString()] // TS 5.4 observes TLiteralValue as not having a toString()
  ) as never
}
// ------------------------------------------------------------------
// IndexedKeyResolve
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexPropertyKeys<T extends TSchema> = (
  T extends TTemplateLiteral  ? TFromTemplateLiteral<T> :
  T extends TUnion<infer S>   ? TFromUnion<S> :
  T extends TLiteral<infer S> ? TFromLiteral<S> :
  T extends TNumber           ? ['[number]'] :  
  T extends TInteger          ? ['[number]'] :
  []
)
/** Returns a tuple of PropertyKeys derived from the given TSchema */
// prettier-ignore
export function IndexPropertyKeys<T extends TSchema>(T: T): TIndexPropertyKeys<T> {
  return [...new Set<string>((
    IsTemplateLiteral(T) ? FromTemplateLiteral(T) :
    IsUnion(T) ? FromUnion(T.anyOf) :
    IsLiteral(T) ? FromLiteral(T.const) :
    IsNumber(T) ? ['[number]'] : 
    IsInteger(T) ? ['[number]'] :
    []
  ))] as never
}
