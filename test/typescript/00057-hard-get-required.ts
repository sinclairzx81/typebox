// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00057-hard-get-required/README.md
//
// Implement the advanced util type GetRequired<T>, which remains all the required fields
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`
  
  type GetRequired<T> = { [K in keyof T as { [P in K]: T[K] } extends { [P in K]-?: T[K] } ? K : never]: T[K] }

  type Result = GetRequired<{ foo: number, bar?: string }> // expected to be { foo: number }

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00057-hard-get-required', () => {
  Assert.IsExtendsMutual<Result, {
    foo: number;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    foo: number;
  }`))
})
