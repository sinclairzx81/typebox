// https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB } = Type.Script(`

  type First<T> = T[0]

  type arr1 = ['a', 'b', 'c']
  type arr2 = [3, 2, 1]

  type ResultA = First<arr1> // expected to be 'a'
  type ResultB = First<arr2> // expected to be 3

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00014-easy-first', () => {
  Assert.IsExtendsMutual<ResultA, `a`>(true)
  Assert.IsExtendsMutual<ResultB, 3>(true)

  Assert.IsEqual(ResultA, Type.Script(`'a'`))
  Assert.IsEqual(ResultB, Type.Script(`3`))
})
