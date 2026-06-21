// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00015-medium-last/README.md
//
// Implement a generic Last<T> that takes an Array T and returns its last element.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB } = Type.Script(`
  
  type Last<T> = T extends [...infer Left, infer Right] ? Right : never

  type arr1 = ['a', 'b', 'c']
  type arr2 = [3, 2, 1]

  type ResultA = Last<arr1> // expected to be 'c'
  type ResultB = Last<arr2> // expected to be 1

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00015-medium-last', () => {
  Assert.IsExtendsMutual<ResultA, 'c'>(true)
  Assert.IsExtendsMutual<ResultB, 1>(true)

  Assert.IsEqual(ResultA, Type.Script(`'c'`))
  Assert.IsEqual(ResultB, Type.Script(`1`))
})
