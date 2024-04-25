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

import type { TSchema } from '../schema/index'
import type { Assert, Ensure } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import type { SchemaOptions } from '../schema/index'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { Number, type TNumber } from '../number/index'
import { KeyOfPropertyKeys, type TKeyOfPropertyKeys } from './keyof-property-keys'
import { UnionEvaluated, type TUnionEvaluated } from '../union/index'
import { CloneType } from '../clone/type'
import { KeyOfFromMappedResult, type TKeyOfFromMappedResult } from './keyof-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult } from '../guard/kind'
// ------------------------------------------------------------------
// FromPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
export type TKeyOfPropertyKeysToRest<T extends PropertyKey[], Acc extends TSchema[] = []> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? L extends '[number]'
      ? TKeyOfPropertyKeysToRest<R, [...Acc, TNumber]>
      : TKeyOfPropertyKeysToRest<R, [...Acc, TLiteral<Assert<L, TLiteralValue>>]>
    : Acc
)
// prettier-ignore
export function KeyOfPropertyKeysToRest<T extends PropertyKey[]>(T: [...T]): TKeyOfPropertyKeysToRest<T> {
  return T.map(L => L === '[number]' ? Number() : Literal(L as TLiteralValue)) as never
}
// ------------------------------------------------------------------
// KeyOfTypeResolve
// ------------------------------------------------------------------
// prettier-ignore
export type TKeyOf<
  T extends TSchema, 
  K extends PropertyKey[] = TKeyOfPropertyKeys<T>,
  S extends TSchema[] = TKeyOfPropertyKeysToRest<K>,
  U = TUnionEvaluated<S>
> = (
  Ensure<U>
)
/** `[Json]` Creates a KeyOf type */
export function KeyOf<T extends TMappedResult>(T: T, options?: SchemaOptions): TKeyOfFromMappedResult<T>
/** `[Json]` Creates a KeyOf type */
export function KeyOf<T extends TSchema>(T: T, options?: SchemaOptions): TKeyOf<T>
/** `[Json]` Creates a KeyOf type */
export function KeyOf(T: TSchema, options: SchemaOptions = {}): any {
  if (IsMappedResult(T)) {
    return KeyOfFromMappedResult(T, options)
  } else {
    const K = KeyOfPropertyKeys(T)
    const S = KeyOfPropertyKeysToRest(K)
    const U = UnionEvaluated(S)
    return CloneType(U, options)
  }
}
