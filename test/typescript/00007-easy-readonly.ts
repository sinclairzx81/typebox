// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00007-easy-readonly/README.md
//
// Implement the built-in Readonly<T> generic without using it. 
//
// Constructs a type with all properties of T set to readonly, meaning the properties of the constructed 
// type cannot be reassigned.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type MyReadonly<T extends object> = { readonly [K in keyof T]: T[K] }

  interface Todo {
    title: string
    description: string
  }

  type Result = MyReadonly<Todo> 

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00007-easy-readonly', () => {
  Assert.IsExtendsMutual<Result, {
    readonly title: string;
    readonly description: string;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    readonly title: string;
    readonly description: string;
  }`))
})