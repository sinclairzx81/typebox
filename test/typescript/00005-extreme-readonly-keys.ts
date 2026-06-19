// https://github.com/type-challenges/type-challenges/blob/main/questions/00005-extreme-readonly-keys/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
export const { Result } = Type.Script(`

  type GetReadonlyKeys<T extends object> = { 
    [K in keyof T]: K extends { -readonly [K in keyof T]: T[K] }[K] ? K : never 
  }[keyof T]

  interface Todo {
    readonly title: string
    readonly description: string
    completed: boolean
  }

  type Result = GetReadonlyKeys<Todo> // expected to be "title" | "description"

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00005-extreme-readonly-keys', () => {
  Assert.IsExtendsMutual<Result, 'title' | 'description'>(true)

  Assert.IsEqual(Result, Type.Script(`'title' | 'description'`))
})
