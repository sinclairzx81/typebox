// https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type MyPick<T, Key> = { [K in keyof T as K extends Key ? K: never]: T[K] }

  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  type Result = MyPick<Todo, 'title' | 'completed'>
`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00004-easy-pick', () => {
  Assert.IsExtendsMutual<Result, {
    title: string;
    completed: boolean;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    title: string;
    completed: boolean;
  }>`))
})