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
import type { Evaluate } from '../helpers/index'
import { IntersectEvaluated, type TIntersectEvaluated } from '../intersect/index'
import { IndexFromPropertyKeys, type TIndexFromPropertyKeys } from '../indexed/index'
import { KeyOfPropertyKeys, type TKeyOfPropertyKeys } from '../keyof/index'
import { type TNever } from '../never/index'
import { Object, type TObject, type TProperties, type ObjectOptions } from '../object/index'
import { SetDistinct, TSetDistinct } from '../sets/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsNever } from '../guard/type'
// ------------------------------------------------------------------
// CompositeKeys
// ------------------------------------------------------------------
// prettier-ignore
type TCompositeKeys<T extends TSchema[], Acc extends PropertyKey[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TCompositeKeys<R, [...Acc, ...TKeyOfPropertyKeys<L>]>
    : TSetDistinct<Acc>
)
// prettier-ignore
function CompositeKeys<T extends TSchema[]>(T: [...T]): TCompositeKeys<T> {
  return SetDistinct(T.reduce((Acc, L) => {
    return ([...Acc, ...KeyOfPropertyKeys(L)]) as never
  }, [])) as never
}
// ------------------------------------------------------------------
// FilterNever
// ------------------------------------------------------------------
// prettier-ignore
type TFilterNever<T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? L extends TNever 
      ? TFilterNever<R, [...Acc]> 
      : TFilterNever<R, [...Acc, L]>
    : Acc
)
// prettier-ignore
function FilterNever<T extends TSchema[]>(T: [...T]): TFilterNever<T> {
  return T.filter(L => !IsNever(L)) as never
}
// ------------------------------------------------------------------
// CompositeProperty
// ------------------------------------------------------------------
// prettier-ignore
type TCompositeProperty<T extends TSchema[], K extends PropertyKey, Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
   ? TCompositeProperty<R, K, [...Acc, ...TIndexFromPropertyKeys<L, [K]>]>
   : TFilterNever<Acc>
)
// prettier-ignore
function CompositeProperty<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): TCompositeProperty<T, K> {
  return FilterNever(T.reduce((Acc, L) => {
    return [...Acc, ...IndexFromPropertyKeys(L, [K])] as never
  }, [])) as never
}
// ------------------------------------------------------------------
// CompositeProperties
// ------------------------------------------------------------------
// prettier-ignore
type TCompositeProperties<T extends TSchema[], K extends PropertyKey[], Acc = {}> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TCompositeProperties<T, R, Acc & { [_ in L]: TIntersectEvaluated<TCompositeProperty<T, L>> }>
    : Acc
)
// prettier-ignore
function CompositeProperties<T extends TSchema[], K extends PropertyKey[] = []>(T: [...T], K: [...K]): TCompositeProperties<T, K> {
  return K.reduce((Acc, L) => {
   return { ...Acc, [L]: IntersectEvaluated(CompositeProperty(T, L)) }
  }, {}) as never
}
// ------------------------------------------------------------------
// Composite
// ------------------------------------------------------------------
// prettier-ignore
type TCompositeEvaluate<
  T extends TSchema[], 
  K extends PropertyKey[] = TCompositeKeys<T>,
  P extends TProperties = Evaluate<TCompositeProperties<T, K>>,
  R extends TObject = TObject<P>
> = R
// prettier-ignore
export type TComposite<T extends TSchema[]> = TCompositeEvaluate<T>

// prettier-ignore
export function Composite<T extends TSchema[]>(T: [...T], options: ObjectOptions = {}): TComposite<T> {
  const K = CompositeKeys(T)
  const P = CompositeProperties(T, K)
  const R = Object(P, options)
  return R as TComposite<T>
}
