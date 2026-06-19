// https://github.com/type-challenges/type-challenges/blob/main/questions/00007-easy-readonly/README.md

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
// Assertion
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