// https://github.com/type-challenges/type-challenges/blob/main/questions/00089-hard-required-keys/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type RequiredKeys<T> = keyof { [K in keyof T as {} extends Pick<T, K> ? never : K]: T[K] }

  type Result = RequiredKeys<{ foo: number; bar?: string }>;

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00089-hard-required-keys', () => {
  Assert.IsExtendsMutual<Result, "foo">(true)

  Assert.IsEqual(Result, Type.Script(`'foo'`))
})
