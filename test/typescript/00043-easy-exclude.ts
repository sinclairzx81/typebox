// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md
//
// Implement the built-in Exclude<T, U>
//
// - Exclude from T those types that are assignable to U
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type MyExclude<T, U> =  T extends U ? never : T;

  type Result = MyExclude<'a' | 'b' | 'c', 'a'>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00043-easy-exclude', () => {
  Assert.IsExtendsMutual<Result, 'b' | 'c'>(true)

  Assert.IsEqual(Result, Type.Script(`'b' | 'c'`))
})
