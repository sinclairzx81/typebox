// https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type Mapped<T> = { [K in keyof T]: T[K] } 

  type Result =  {}

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('test', () => {
  Assert.IsExtendsMutual<Result, object>(true)

  Assert.IsEqual(Result, Type.Script(`object`))
})
