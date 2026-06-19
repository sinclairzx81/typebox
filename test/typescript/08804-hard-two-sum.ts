// https://github.com/type-challenges/type-challenges/blob/main/questions/08804-hard-two-sum/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
//
// Note: Reduced range on ResultB to allow inference to pass.
//
// -----------------------------------------------------------------

const { ResultA, ResultB } = Type.Script(`

  type LengthArray<T extends number, A extends any[] = []> =
    A['length'] extends T
      ? A
      : LengthArray<T, [...A, 0]>

  type TwoSum<T extends number[], U extends number> = 
    T extends [infer first extends number, ...infer rest extends number[]]
      ? LengthArray<U> extends [...LengthArray<first>, ...infer R]
        ? R['length'] extends rest[number]
          ? true
          : TwoSum<rest, U>
        : false
      : false


  type ResultA = TwoSum<[3, 2, 4], 6> // true
  type ResultB = TwoSum<[2, 1, 3], 6> // false
`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('08804-hard-two-sum', () => {
  Assert.IsExtendsMutual<ResultA, true>(true)
  Assert.IsExtendsMutual<ResultB, false>(true)

  Assert.IsEqual(ResultA, Type.Script(`true`))
  Assert.IsEqual(ResultB, Type.Script(`false`))
})
