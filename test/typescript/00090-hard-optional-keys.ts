// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00090-hard-optional-keys/README.md
//
// Implement the advanced util type OptionalKeys<T>, which picks all the optional keys into a union.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type OptionalKeys<T> = { [P in keyof T]-?: {} extends Pick<T, P> ? P:never}[keyof T]

  type Result = OptionalKeys<{ foo: number; bar?: string, baz?: string }>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00090-hard-optional-keys', () => {
  Assert.IsExtendsMutual<Result, 'bar' | 'baz'>(true)

  Assert.IsEqual(Result, Type.Script(`'bar' | 'baz'`))
})
