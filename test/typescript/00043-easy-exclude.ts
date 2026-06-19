// https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type MyExclude<T, U> = Exclude<T, U>

  type Result = MyExclude<'a' | 'b' | 'c', 'a'>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00043-easy-exclude', () => {
  Assert.IsExtendsMutual<Result, 'b' | 'c'>(true)

  Assert.IsEqual(Result, Type.Script(`'b' | 'c'`))
})
