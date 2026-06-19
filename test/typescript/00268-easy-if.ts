// https://github.com/type-challenges/type-challenges/blob/main/questions/00268-easy-if/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type If<C extends boolean, T, F> = C extends true ? T : F;

  type A = If<true, 'a', 'b'>   // expected to be 'a'
  type B = If<false, 'a', 'b'>  // expected to be 'b'
  
  type Result = [A, B]          // for assertion

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00268-easy-if', () => {
  Assert.IsExtendsMutual<Result, ['a', 'b']>(true)

  Assert.IsEqual(Result, Type.Script(`['a', 'b']`))
})
