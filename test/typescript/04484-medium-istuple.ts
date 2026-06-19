// https://github.com/type-challenges/type-challenges/blob/main/questions/04484-medium-istuple/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC } = Type.Script(`

  type IsTuple<T> = T extends [infer _ extends unknown] ? true : false

  type ResultA = IsTuple<[number]>          // true
  type ResultB = IsTuple<readonly [number]> // true
  type ResultC = IsTuple<number[]>          // false
`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('04484-medium-istuple', () => {
  Assert.IsExtendsMutual<ResultA, true>(true)
  Assert.IsExtendsMutual<ResultB, true>(true)
  Assert.IsExtendsMutual<ResultC, true>(false)

  Assert.IsEqual(ResultA, Type.Script(`true`))
  Assert.IsEqual(ResultB, Type.Script(`true`))
  Assert.IsEqual(ResultC, Type.Script(`false`))
})
