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
import { type TObject, type TProperties, type ObjectOptions, Object } from '../object/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { KeyOfPropertyKeys } from '../keyof/index'
import { Index, type TIndex } from '../indexed/index'
import { CloneType } from '../clone/type'

// ------------------------------------------------------------------
// CompositeResolve
// ------------------------------------------------------------------
// prettier-ignore
type CompositeKeys<T extends TObject[]> =
  T extends [infer L extends TObject, ...infer R extends TObject[]]
    ? keyof L['properties'] | CompositeKeys<R>
    : never
// prettier-ignore
type CompositeIndex<T extends TIntersect<TObject[]>, K extends string[]> =
  K extends [infer L extends string, ...infer R extends string[]]
    ? { [_ in L]: TIndex<T, [L]> } & CompositeIndex<T, R>
    : {}
// prettier-ignore
type CompositeReduce<T extends TObject[]> = UnionToTuple<CompositeKeys<T>> extends infer K
  ? Evaluate<CompositeIndex<TIntersect<T>, Assert<K, string[]>>>
  : {} //                    ^ indexed via intersection of T
// prettier-ignore
export type CompositeResolve<T extends TObject[]> = TIntersect<T> extends TIntersect
  ? TObject<CompositeReduce<T>>
  : TObject<{}>
export function CompositeResolve<T extends TObject[]>(T: [...T]): CompositeResolve<T> {
  const intersect: TSchema = Intersect(T, {})
  const keys = KeyOfPropertyKeys(intersect) as string[]
  const properties = keys.reduce((acc, key) => ({ ...acc, [key]: Index(intersect, [key]) }), {} as TProperties)
  return Object(properties) as CompositeResolve<T>
}
// ------------------------------------------------------------------
// TComposite
// ------------------------------------------------------------------
export type TComposite<T extends TObject[]> = CompositeResolve<T>

/** `[Json]` Creates a Composite object type */
export function Composite<T extends TObject[]>(T: [...T], options?: ObjectOptions): TComposite<T> {
  return CloneType(CompositeResolve(T) as TObject, options) as TComposite<T>
}
