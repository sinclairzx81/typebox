// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00008-medium-readonly-2/README.md
//
// Implement a generic MyReadonly2<T, K> which takes two type argument T and K.
//
// K specify the set of properties of T that should set to Readonly. When K is not provided, it should make 
// all properties readonly just like the normal Readonly<T>.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type MyReadonly2<T, K extends keyof T = keyof T> = Evaluate<
    Omit<T, K> &
    Readonly<Pick<T, K>>
  >
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  type Result =  MyReadonly2<Todo, 'title' | 'description'> 

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00008-medium-readonly-2', () => {
  Assert.IsExtendsMutual<Result, {
    completed: boolean;
    readonly title: string;
    readonly description: string;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    completed: boolean;
    readonly title: string;
    readonly description: string;  
  }`))
})
