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
import type { UnionToTuple, Assert, Evaluate } from '../helpers/index'
import { Object, type TObject, type TProperties, type ObjectOptions } from '../object/index'
import { Intersect, type TIntersect } from '../intersect/index'
import { Index, type TIndex } from '../indexed/index'
import { KeyOfPropertyKeys } from '../keyof/index'
import { CloneType } from '../clone/type'

// ------------------------------------------------------------------
// TCompositeKeys
// ------------------------------------------------------------------
// prettier-ignore
type TCompositeKeys<T extends TObject[], Acc extends PropertyKey = never> =
  T extends [infer L extends TObject, ...infer R extends TObject[]]
    ? TCompositeKeys<R, Acc | keyof L['properties']>
    : Acc
// ------------------------------------------------------------------
// TCompositeIndex
// ------------------------------------------------------------------
// prettier-ignore
type TCompositeIndex<T extends TIntersect<TObject[]>, K extends string[], Acc extends TProperties = {}> =
  K extends [infer L extends string, ...infer R extends string[]]
    ? TCompositeIndex<T, R, Acc & { [_ in L]: TIndex<T, [L]> }>
    : Acc
// prettier-ignore
type TCompositeReduce<T extends TObject[]> = UnionToTuple<TCompositeKeys<T>> extends infer K
  ? Evaluate<TCompositeIndex<TIntersect<T>, Assert<K, string[]>>>
  : {} //                    ^ indexed via intersection of T
// prettier-ignore
type TCompositeResolve<T extends TObject[]> = TIntersect<T> extends TIntersect
  ? TObject<TCompositeReduce<T>>
  : TObject<{}>
function CompositeResolve<T extends TObject[]>(T: [...T]): TCompositeResolve<T> {
  const intersect: TSchema = Intersect(T, {})
  const keys = KeyOfPropertyKeys(intersect) as string[]
  const properties = keys.reduce((acc, key) => ({ ...acc, [key]: Index(intersect, [key]) }), {} as TProperties)
  return Object(properties) as TCompositeResolve<T>
}
// ------------------------------------------------------------------
// TComposite
// ------------------------------------------------------------------
export type TComposite<T extends TObject[]> = TCompositeResolve<T>

/** `[Json]` Creates a Composite object type */
export function Composite<T extends TObject[]>(T: [...T], options?: ObjectOptions): TComposite<T> {
  return CloneType(CompositeResolve(T) as TObject, options) as TComposite<T>
}
