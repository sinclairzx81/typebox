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
//
// Operators (Set-Theory)
//
// The following functions perform common set-theory operations
// across arrays of PropertyKey. These operators are used in
// Intersect and Union composition.
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// OperatorIncludes
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorIncludes<T extends PropertyKey[], S extends PropertyKey> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? S extends L 
      ? true 
      : OperatorIncludes<R, S>
    : false
)
/** Returns true if element S is in the set of T */
// prettier-ignore
export function OperatorIncludes<T extends PropertyKey[], S extends PropertyKey>(T: [...T], S: S): OperatorIncludes<T, S> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? S === L 
        ? true 
        : OperatorIncludes(R, S)
      : false
  ) as OperatorIncludes<T, S>
}
// ------------------------------------------------------------------
// OperatorSubset
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorSubset<T extends PropertyKey[], S extends PropertyKey[]> =
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? OperatorIncludes<S, L> extends true
      ? OperatorSubset<R, S>
      : false
    : true

/** Returns true if T is a subset of S */
// prettier-ignore
export function OperatorSubset<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): OperatorSubset<T, S> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? OperatorIncludes(S, L) === true
        ? OperatorSubset(R, S)
        : false
      : true
  ) as OperatorSubset<T, S>
}
// ------------------------------------------------------------------
// OperatorDistinct
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorDistinct<T extends PropertyKey[], Acc extends PropertyKey[] = []> =
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? OperatorIncludes<Acc, L> extends false
      ? OperatorDistinct<R, [...Acc, L]>
      : OperatorDistinct<R, [...Acc]>
    : Acc
/** Returns a distinct set of elements */
// prettier-ignore
export function OperatorDistinct<T extends PropertyKey[]>(T: [...T], Acc: PropertyKey[] = []): OperatorDistinct<T> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? OperatorIncludes(Acc, L) === false
        ? OperatorDistinct(R, [...Acc, L])
        : OperatorDistinct(R, [...Acc])
      : Acc
  ) as OperatorDistinct<T>
}
// ------------------------------------------------------------------
// OperatorIntersect
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorIntersect<T extends PropertyKey[], S extends PropertyKey[]> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? OperatorIncludes<S, L> extends true
      ? [L, ...OperatorIntersect<R, S>]
      : [...OperatorIntersect<R, S>]
    : []
)
/** Returns the Intersect of the given sets */
// prettier-ignore
export function OperatorIntersect<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): OperatorIntersect<T, S> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? OperatorIncludes(S, L) === true
        ? [L, ...OperatorIntersect(R, S)]
        : [...OperatorIntersect(R, S)]
      : []
  ) as OperatorIntersect<T, S>
}
// ------------------------------------------------------------------
// OperatorUnion
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorUnion<T extends PropertyKey[], S extends PropertyKey[]> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? OperatorIncludes<S, L> extends true
      ? [...OperatorUnion<R, S>]
      : [L, ...OperatorUnion<R, S>]
    : S
)
/** Returns the Union of the given sets */
// prettier-ignore
export function OperatorUnion<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): OperatorUnion<T, S> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? OperatorIncludes(S, L) === true
        ? [...OperatorUnion(R, S)]
        : [L, ...OperatorUnion(R, S)]
      : S
  ) as OperatorUnion<T, S>
}
// ------------------------------------------------------------------
// OperatorComplement
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorComplement<T extends PropertyKey[], S extends PropertyKey[]> = (
  T extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? OperatorIncludes<S, L> extends true
      ? [...OperatorComplement<R, S>]
      : [L, ...OperatorComplement<R, S>]
    : []
)
/** Returns the Complement by omitting elements in T that are in S */
// prettier-ignore
export function OperatorComplement<T extends PropertyKey[], S extends PropertyKey[]>(T: [...T], S: [...S]): OperatorComplement<T, S> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? OperatorIncludes(S, L) === true
        ? [...OperatorComplement(R, S)]
        : [L, ...OperatorComplement(R, S)]
      : []
  ) as OperatorComplement<T, S>
}
// ------------------------------------------------------------------
// OperatorIntersectMany
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorIntersectMany<T extends PropertyKey[][]> = (
  T extends [infer L extends PropertyKey[]]
    ? L
      : T extends [infer L extends PropertyKey[], ...infer R extends PropertyKey[][]]
        ? OperatorIntersect<L, OperatorIntersectMany<R>>
        : []
)
/** Returns the Intersect of multiple sets */
// prettier-ignore
export function OperatorIntersectMany<T extends PropertyKey[][]>(T: [...T]): OperatorIntersectMany<T> {
  return (
    T.length === 1
      ? T[0]
      : (() => {
        const [L, ...R] = T
        return (
          L.length > 0
            ? OperatorIntersect(L, OperatorIntersectMany(R))
            : [] 
        )
      })()
  ) as OperatorIntersectMany<T>
}
// ------------------------------------------------------------------
// OperatorUnionMany
// ------------------------------------------------------------------
// prettier-ignore
export type OperatorUnionMany<T extends PropertyKey[][]> = (
  T extends [infer L extends PropertyKey[]] 
    ? L
    : T extends [infer L extends PropertyKey[], ...infer R extends PropertyKey[][]]
      ? OperatorUnion<L, OperatorUnionMany<R>>
      : []
)
/** Returns the Union of multiple sets */
export function OperatorUnionMany<T extends PropertyKey[][]>(T: [...T]): OperatorUnionMany<T> {
  return (
    T.length === 1
      ? T[0]
      : (() => {
          const [L, ...R] = T
          return T.length > 0 ? OperatorUnion(L, OperatorUnionMany(R)) : []
        })()
  ) as OperatorUnionMany<T>
}
