// https://github.com/type-challenges/type-challenges/blob/main/questions/05317-medium-lastindexof/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB } = Type.Script(`

  type Equal<L, R> = L extends R ? R extends L ? true : false : false

  type LastIndexOf<T extends any[], U, Index extends unknown[] = [], Last extends number = -1> = 
    T extends [infer Left, ...infer Right]
      ? LastIndexOf<Right, U, [...Index, unknown], Equal<Left, U> extends true ? Index['length'] : Last>
      : Last

  type ResultA = LastIndexOf<[1, 2, 3, 2, 1], 2>  // 3
  type ResultB = LastIndexOf<[0, 0, 0], 2>        // -1

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('05317-medium-lastindexof', () => {
  Assert.IsExtendsMutual<ResultA, 3>(true)
  Assert.IsExtendsMutual<ResultB, -1>(true)

  Assert.IsEqual(ResultA, Type.Script(`3`))
  Assert.IsEqual(ResultB, Type.Script(`-1`))
})
