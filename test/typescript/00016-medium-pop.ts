// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00016-medium-pop/README.md
//
// Implement a generic Pop<T> that takes an Array T and returns an Array without it's last element.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB } = Type.Script(`

  type Pop<T> = T extends [...infer Left, infer Right] ? Left : []

  type arr1 = ['a', 'b', 'c', 'd']
  type arr2 = [3, 2, 1]

  type ResultA = Pop<arr1> // expected to be ['a', 'b', 'c']
  type ResultB = Pop<arr2> // expected to be [3, 2]

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00016-medium-pop', () => {
  Assert.IsExtendsMutual<ResultA, ['a', 'b', 'c']>(true)
  Assert.IsExtendsMutual<ResultB, [3, 2]>(true)

  Assert.IsEqual(ResultA, Type.Script(`['a', 'b', 'c']`))
  Assert.IsEqual(ResultB, Type.Script(`[3, 2]`))
})
