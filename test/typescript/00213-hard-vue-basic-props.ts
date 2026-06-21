// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00213-hard-vue-basic-props/README.md
//
// In addition to the Simple Vue, we are now having a new props field in the options. This is a simplified 
// version of Vue's props option. Here are some of the rules.
//
// props is an object containing each field as the key of the real props injected into this. The injected 
// props will be accessible in all the context including data, computed, and methods.
//
// A prop will be defined either by a constructor or an object with a type field containing constructor(s).
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type ToUnion<Input extends unknown[], Result extends unknown = never> = 
    Input extends [infer Left, ...infer Right]
      ? ToUnion<Right, Result | Left>
      : Evaluate<Result>

  type Output<T> = {
    [K in keyof T]: T[K] extends { type: infer X extends unknown[] }
      ? ToUnion<X>
      : never
  }

  type Input = {
    foo: { type: [number, string, boolean] } // close enough
  }

  type Result = Output<Input>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00213-hard-vue-basic-props', () => {
  Assert.IsExtendsMutual<Result, {
    foo: number | string | boolean;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    foo: number | string | boolean;
  }`))
})
