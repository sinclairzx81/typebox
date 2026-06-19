// https://github.com/type-challenges/type-challenges/blob/main/questions/00213-hard-vue-basic-props/README.md

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
// Assertion
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
