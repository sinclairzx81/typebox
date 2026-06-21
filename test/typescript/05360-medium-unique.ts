// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/05360-medium-unique/README.md
//
// Implement the type version of Lodash.uniq, Unique takes an Array T, returns the Array T without repeated 
// values.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC, ResultD, ResultE } = Type.Script(`
  type Equal<L, R> = L extends R ? R extends L ? true : false : false

  type Includes<T, U> = U extends [infer F, ...infer Rest] 
    ? Equal<F, T> extends true 
      ? true 
      : Includes<T, Rest> 
    : false;

  type Unique<T, U extends any[] = []> = 
    T extends [infer R, ...infer F]
      ? Includes<R, U> extends true
        ? Unique<F, [...U]>
        : Unique<F, [...U, R]>
      : U

  type ResultA = Unique<[1, 1, 2, 2, 3, 3]>;                                     // expected to be [1, 2, 3]
  type ResultB = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>;                               // expected to be [1, 2, 3, 4, 5, 6, 7]
  type ResultC = Unique<[1, "a", 2, "b", 2, "a"]>;                               // expected to be [1, "a", 2, "b"]
  type ResultD = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
  type ResultE = Unique<[unknown, unknown, any, any, never, never]>;             // expected to be [unknown, never] // missing any (review)
`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>
type ResultD = Type.Static<typeof ResultD>
type ResultE = Type.Static<typeof ResultE>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('05360-medium-unique', () => {
  Assert.IsExtendsMutual<ResultA, [1, 2, 3]>(true)
  Assert.IsExtendsMutual<ResultB, [1, 2, 3, 4, 5, 6, 7]>(true)
  Assert.IsExtendsMutual<ResultC, [1, "a", 2, "b"]>(true)
  Assert.IsExtendsMutual<ResultD, [string, number, 1, "a", 2, "b"]>(true)
  Assert.IsExtendsMutual<ResultE, [unknown, never]>(true)

  Assert.IsEqual(ResultA, Type.Script(`[1, 2, 3]`))
  Assert.IsEqual(ResultB, Type.Script(`[1, 2, 3, 4, 5, 6, 7]`))
  Assert.IsEqual(ResultC, Type.Script(`[1, "a", 2, "b"]`))
  Assert.IsEqual(ResultD, Type.Script(`[string, number, 1, "a", 2, "b"]`))
  Assert.IsEqual(ResultE, Type.Script(`[unknown, never]`)) // missing any (review)
})
