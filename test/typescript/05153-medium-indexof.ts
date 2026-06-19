// https://github.com/type-challenges/type-challenges/blob/main/questions/05153-medium-indexof/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC } = Type.Script(`

  type Equal<L, R> = L extends R ? R extends L ? true : false : false

  type IndexOf<T extends any[], U, Pass extends any[] = []> = 
    T extends [infer F, ...infer Rest] 
      ? Equal<F, U> extends true
        ? Pass['length'] 
        : IndexOf<Rest, U, [...Pass, F]>
      : -1

  type ResultA = IndexOf<[1, 2, 3], 2>;                   // expected to be 1
  type ResultB = IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>; // expected to be 2
  type ResultC = IndexOf<[0, 0, 0], 2>;                   // expected to be -1

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('05153-medium-indexof', () => {
  Assert.IsExtendsMutual<ResultA, 1>(true)
  Assert.IsExtendsMutual<ResultB, 2>(true)
  Assert.IsExtendsMutual<ResultC, -1>(true)

  Assert.IsEqual(ResultA, Type.Script(`1`))
  Assert.IsEqual(ResultB, Type.Script(`2`))
  Assert.IsEqual(ResultC, Type.Script(`-1`))
})
