// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/27958-medium-checkrepeatedtuple/README.md
//
// Implement type CheckRepeatedChars<T> which will return whether type T contains duplicated member
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB } = Type.Script(`

  
  type CheckRepeatedTuple<T extends unknown[]> = T extends [infer L, ...infer R] ? L extends R[number] ? true : CheckRepeatedTuple<R> : false

  type ResultA = CheckRepeatedTuple<[1, 2, 3]>
  type ResultB = CheckRepeatedTuple<[1, 2, 1]>

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('27958-medium-checkrepeatedtuple', () => {
  Assert.IsExtendsMutual<ResultA, false>(true)
  Assert.IsExtendsMutual<ResultB, true>(true)

  Assert.IsEqual(ResultA, Type.Script(`false`))
  Assert.IsEqual(ResultB, Type.Script(`true`))
})
