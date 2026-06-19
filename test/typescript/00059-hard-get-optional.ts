// https://github.com/type-challenges/type-challenges/blob/main/questions/00059-hard-get-optional/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`
    
  type GetOptional<T> = { [K in keyof T as { [P in K]: T[K] } extends { [P in K]-?: T[K] } ? never : K]: T[K] }

  type Result = GetOptional<{ foo: number, bar?: string }> // expected to be { bar?: string }

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00059-hard-get-optional', () => {
  Assert.IsExtendsMutual<Result, {
    bar?: string;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    bar?: string;
  }`))
})
