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

import { type TTemplateLiteral, TemplateLiteralGenerate, TemplateLiteralParseExact, IsTemplateLiteralFinite, TemplateLiteralToUnion } from '../template-literal/index'
import { type TLiteral, type TLiteralValue } from '../literal/index'
import { type TInteger } from '../integer/index'
import { type TNumber } from '../number/index'
import { type TSchema } from '../schema/index'
import { type TUnion } from '../union/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TTemplateLiteral as IsTemplateLiteralType, 
  TUnionLiteral as IsUnionLiteralType, 
  TUnion as IsUnionType, 
  TLiteral as IsLiteralType, 
  TNumber as IsNumberType, 
  TInteger as IsIntegerType 
} from '../guard/type'

// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
type FromTemplateLiteral<T extends TTemplateLiteral, F = IsTemplateLiteralFinite<T>> = (
  F extends true 
    ? TemplateLiteralGenerate<T> extends infer R extends string[] ? R : []
    : []
)
// prettier-ignore
function FromTemplateLiteral<T extends TTemplateLiteral>(T: T): FromTemplateLiteral<T> {
  const E = TemplateLiteralParseExact(T.pattern)
  const F = IsTemplateLiteralFinite(E)
  const S = TemplateLiteralToUnion(T)
  return (
    F === true
    ? IsUnionLiteralType(S)
      ? S.anyOf.map(S => S.const.toString())
      : []
    : []
  ) as FromTemplateLiteral<T>
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type FromUnion<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? [...TIndexPropertyKeys<L>, ...FromUnion<R>] 
    : []
)
// prettier-ignore
function FromUnion<T extends TSchema[]>(T: T): FromUnion<T>{
  const [L, ...R] = T
  return (
    T.length > 0
      ? [...IndexPropertyKeys(L), ...FromUnion(R)] 
      : []
  ) as FromUnion<T>
}
// ------------------------------------------------------------------
// FromLiteral
// ------------------------------------------------------------------
// prettier-ignore
type FromLiteral<T extends TLiteralValue> = (
  T extends PropertyKey 
    ? [`${T}`] 
    : []
)
// prettier-ignore
function FromLiteral<T extends TLiteralValue>(T: T): FromLiteral<T> {
  return (
    [T.toString()] 
  ) as FromLiteral<T>
}
// ------------------------------------------------------------------
// IndexedKeyResolve
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexPropertyKeys<T extends TSchema> = (
  T extends TTemplateLiteral  ? FromTemplateLiteral<T> :
  T extends TUnion<infer S>   ? FromUnion<S> :
  T extends TLiteral<infer S> ? FromLiteral<S> :
  T extends TNumber           ? ['[number]'] :  
  T extends TInteger          ? ['[number]'] :
  []
)
/** Returns a tuple of PropertyKeys derived from the given TSchema */
// prettier-ignore
export function IndexPropertyKeys<T extends TSchema>(T: T): TIndexPropertyKeys<T> {
  return [...new Set<string>((
    IsTemplateLiteralType(T) ? FromTemplateLiteral(T) :
    IsUnionType(T) ? FromUnion(T.anyOf) :
    IsLiteralType(T) ? FromLiteral(T.const) :
    IsNumberType(T) ? ['[number]'] : 
    IsIntegerType(T) ? ['[number]'] :
    []
  ))] as TIndexPropertyKeys<T>
}
