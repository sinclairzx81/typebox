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

import type { TSchema } from '../schema/index'
import type { Ensure } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { type TLiteral, TLiteralValue, Literal } from '../literal/index'
import { type TNumber, Number } from '../number/index'
import { type SchemaOptions } from '../schema/index'
import { KeyOfPropertyKeys } from './keyof-property-keys'
import { UnionEvaluated } from '../union/index'
import { CloneType } from '../clone/type'

import { KeyOfFromMappedResult, type TKeyOfFromMappedResult } from './keyof-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TMappedResult as IsMappedResultType 
} from '../guard/type'
// ------------------------------------------------------------------
// FromLiterals
// ------------------------------------------------------------------
// prettier-ignore
type FromLiterals<T extends TLiteralValue[]> = (
  T extends [infer L extends TLiteralValue, ...infer R extends TLiteralValue[]]
    ? L extends '[number]'
      ? [TNumber, ...FromLiterals<R>]
      : [TLiteral<L>, ...FromLiterals<R>]
    : []
)
// prettier-ignore
function FromLiterals<T extends TLiteralValue[]>(T: [...T]): FromLiterals<T> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? L === '[number]'
        ? [Number(), ...FromLiterals(R)]
        : [Literal(L as TLiteralValue), ...FromLiterals(R)]
      : []
  ) as FromLiterals<T>
}
// ------------------------------------------------------------------
// KeyOfTypeResolve
// ------------------------------------------------------------------
// prettier-ignore
export type TKeyOf<T extends TSchema> = (
  Ensure<UnionEvaluated<FromLiterals<KeyOfPropertyKeys<T>>>>
)

/** `[Json]` Creates a KeyOf type */
export function KeyOf<T extends TMappedResult>(T: T, options?: SchemaOptions): TKeyOfFromMappedResult<T>
/** `[Json]` Creates a KeyOf type */
export function KeyOf<T extends TSchema>(T: T, options?: SchemaOptions): TKeyOf<T>
/** `[Json]` Creates a KeyOf type */
export function KeyOf(T: TSchema, options: SchemaOptions = {}): any {
  if (IsMappedResultType(T)) {
    return KeyOfFromMappedResult(T, options)
  } else {
    const K = UnionEvaluated(FromLiterals(KeyOfPropertyKeys(T) as TLiteralValue[]))
    return CloneType(K, options)
  }
}
