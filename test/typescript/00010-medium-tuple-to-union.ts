// https://github.com/type-challenges/type-challenges/blob/main/questions/00010-medium-tuple-to-union/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type TupleToUnion<T extends unknown[], Result extends unknown = never> = (
    T extends [infer L extends unknown, ...infer R extends unknown[]]
      ? TupleToUnion<R, Result | L>
      : Evaluate<Result> // flatten
  )
  type Arr = ['1', '2', '3']

  type Result = TupleToUnion<Arr>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00010-medium-tuple-to-union', () => {
  Assert.IsExtendsMutual<Result, "1" | "2" | "3">(true)

  Assert.IsEqual(Result, Type.Script(`'1' | '2' | '3'`))
})
