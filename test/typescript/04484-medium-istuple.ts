// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/04484-medium-istuple/README.md
//
// Implement a type IsTuple, which takes an input type T and returns whether T is tuple type.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC, ResultD } = Type.Script(`

  type IsTuple<T> = T extends [...infer _ extends unknown[]] ? true : false

  type ResultA = IsTuple<[number]>          // true
  type ResultB = IsTuple<readonly [number]> // true
  type ResultC = IsTuple<[number, number]>  // true
  type ResultD = IsTuple<number[]>          // false
`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>
type ResultD = Type.Static<typeof ResultD>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('04484-medium-istuple', () => {
  Assert.IsExtendsMutual<ResultA, true>(true)
  Assert.IsExtendsMutual<ResultB, true>(true)
  Assert.IsExtendsMutual<ResultC, true>(true)
  Assert.IsExtendsMutual<ResultD, true>(false)

  Assert.IsEqual(ResultA, Type.Script(`true`))
  Assert.IsEqual(ResultB, Type.Script(`true`))
  Assert.IsEqual(ResultC, Type.Script(`true`))
  Assert.IsEqual(ResultD, Type.Script(`false`))
})
