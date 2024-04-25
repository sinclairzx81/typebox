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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { Static } from '../static/index'
import { type TUnion, Union } from '../union/index'
import { TMappedKey, TMappedResult } from '../mapped/index'
import { ExtendsCheck, ExtendsResult } from './extends-check'
import { UnionToTuple } from '../helpers/index'
import { CloneType } from '../clone/type'
import { ExtendsFromMappedKey, type TExtendsFromMappedKey } from './extends-from-mapped-key'
import { ExtendsFromMappedResult, type TExtendsFromMappedResult } from './extends-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedKey, IsMappedResult } from '../guard/kind'

// prettier-ignore
type TExtendsResolve<L extends TSchema, R extends TSchema, T extends TSchema, U extends TSchema> = (
  (Static<L> extends Static<R> ? T : U) extends infer O extends TSchema ?
    UnionToTuple<O> extends [infer X extends TSchema, infer Y extends TSchema]
    ? TUnion<[X, Y]>
    : O
    : never
)
// prettier-ignore
function ExtendsResolve<L extends TSchema, R extends TSchema, T extends TSchema, U extends TSchema>(left: L, right: R, trueType: T, falseType: U): TExtendsResolve<L, R, T, U> {
  const R = ExtendsCheck(left, right)
  return (
    R === ExtendsResult.Union ? Union([trueType, falseType]) : 
    R === ExtendsResult.True ? trueType : 
    falseType
  ) as never
}
// ------------------------------------------------------------------
// TExtends
// ------------------------------------------------------------------
export type TExtends<L extends TSchema, R extends TSchema, T extends TSchema, F extends TSchema> = TExtendsResolve<L, R, T, F>

/** `[Json]` Creates a Conditional type */
export function Extends<L extends TMappedResult, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtendsFromMappedResult<L, R, T, F>
/** `[Json]` Creates a Conditional type */
export function Extends<L extends TMappedKey, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtendsFromMappedKey<L, R, T, F>
/** `[Json]` Creates a Conditional type */
export function Extends<L extends TSchema, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtends<L, R, T, F>
/** `[Json]` Creates a Conditional type */
export function Extends<L extends TSchema, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options: SchemaOptions = {}) {
  // prettier-ignore
  return (
    IsMappedResult(L) ? ExtendsFromMappedResult(L, R, T, F, options) :
    IsMappedKey(L) ? CloneType(ExtendsFromMappedKey(L, R, T, F, options)) :
    CloneType(ExtendsResolve(L, R, T, F), options)
  ) as never
}
