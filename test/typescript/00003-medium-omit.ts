// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md
//
// Implement the built-in Omit<T, K> generic without using it. 
// 
// Constructs a type by picking all properties from T and then removing K.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
export const { Result } = Type.Script(`
  type MyOmit<T, Key> = { 
    [K in keyof T as K extends Key ? never: K]: T[K] 
  }
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  type Result = MyOmit<Todo, 'description' | 'title'>
`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00003-medium-omit', () => {
  Assert.IsExtendsMutual<Result, {
    completed: boolean;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    completed: boolean;
  }>`))
})