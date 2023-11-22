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

// ------------------------------------------------------------------
// SetIncludes
// ------------------------------------------------------------------
// prettier-ignore
export type TSetIncludes<T extends PropertyKey[], S extends PropertyKey> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? S extends L 
      ? true 
      : TSetIncludes<R, S>
    : false
)
/** Returns true if element S is in the set of T */
// prettier-ignore
export function SetIncludes<T extends PropertyKey[], S extends PropertyKey>(T: [...T], S: S): TSetIncludes<T, S> {
  return T.includes(S) as TSetIncludes<T, S>
}
// ------------------------------------------------------------------
// SetIsSubset
// ------------------------------------------------------------------
// prettier-ignore
export type SetIsSubset<T extends PropertyKey[], S extends PropertyKey[]> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TSetIncludes<S, L> extends true
      ? SetIsSubset<R, S>
      : false
    : true
)
/** Returns true if T is a subset of S */
export function SetIsSubset<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): SetIsSubset<T, S> {
  return T.every((L) => SetIncludes(S, L)) as SetIsSubset<T, S>
}
// ------------------------------------------------------------------
// SetDistinct
// ------------------------------------------------------------------
// prettier-ignore
export type TSetDistinct<T extends PropertyKey[], Acc extends PropertyKey[] = []> =
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TSetIncludes<Acc, L> extends false
      ? TSetDistinct<R, [...Acc, L]>
      : TSetDistinct<R, [...Acc]>
    : Acc
/** Returns a distinct set of elements */
export function SetDistinct<T extends PropertyKey[]>(T: [...T]): TSetDistinct<T> {
  return [...new Set(T)] as TSetDistinct<T>
}
// ------------------------------------------------------------------
// SetIntersect
// ------------------------------------------------------------------
// prettier-ignore
export type TSetIntersect<T extends PropertyKey[], S extends PropertyKey[], Acc extends PropertyKey[] = []> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TSetIncludes<S, L> extends true
      ? TSetIntersect<R, S, [L, ...Acc]>
      : TSetIntersect<R, S, [...Acc]>
    : Acc
)
/** Returns the Intersect of the given sets */
export function SetIntersect<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): TSetIntersect<T, S> {
  return T.filter((L) => S.includes(L)) as TSetIntersect<T, S>
}
// ------------------------------------------------------------------
// SetUnion
// ------------------------------------------------------------------
// prettier-ignore
export type TSetUnion<T extends PropertyKey[], S extends PropertyKey[], Acc extends PropertyKey[] = S> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TSetUnion<R, S, [...Acc, L]>
    : Acc
)
/** Returns the Union of the given sets */
export function SetUnion<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): TSetUnion<T, S> {
  return [...T, ...S] as never
}
// ------------------------------------------------------------------
// SetComplement
// ------------------------------------------------------------------
// prettier-ignore
export type TSetComplement<T extends PropertyKey[], S extends PropertyKey[], Acc extends PropertyKey[] = []> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TSetIncludes<S, L> extends true
      ? TSetComplement<R, S, [...Acc]>
      : TSetComplement<R, S, [...Acc, L]>
    : Acc
)
/** Returns the Complement by omitting elements in T that are in S */
// prettier-ignore
export function SetComplement<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): TSetComplement<T, S> {
  return T.filter(L => !S.includes(L)) as TSetComplement<T, S>
}
// ------------------------------------------------------------------
// SetIntersectMany
// ------------------------------------------------------------------
// prettier-ignore
export type TSetIntersectMany<T extends PropertyKey[][], Acc extends PropertyKey[] = []> = (
  T extends [infer L extends PropertyKey[]] ? L :
  T extends [infer L extends PropertyKey[], ...infer R extends PropertyKey[][]]
    ? TSetIntersectMany<R, TSetIntersect<Acc, L>>
    : Acc
)
/** Returns the Intersect of multiple sets */
// prettier-ignore
export function SetIntersectMany<T extends PropertyKey[][]>(T: [...T]): TSetIntersectMany<T> {
  return (
    T.length === 1 ? T[0] : T.reduce((Acc, L) => [...SetIntersect(Acc, L)], [])
  ) as TSetIntersectMany<T>
}
// ------------------------------------------------------------------
// SetUnionMany
// ------------------------------------------------------------------
// prettier-ignore
export type TSetUnionMany<T extends PropertyKey[][], Acc extends PropertyKey[] = []> = (
  T extends [infer L extends PropertyKey[], ...infer R extends PropertyKey[][]]
    ? TSetUnionMany<R, TSetUnion<Acc, L>>
    : Acc
)
/** Returns the Union of multiple sets */
export function SetUnionMany<T extends PropertyKey[][]>(T: [...T]): TSetUnionMany<T> {
  return T.reduce((Acc, L) => [...Acc, ...L], [] as PropertyKey[]) as TSetUnionMany<T>
}
