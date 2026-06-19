// https://github.com/type-challenges/type-challenges/blob/main/questions/29650-medium-extracttoobject/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`
  type ExtractToObject<T, P extends keyof T> = Omit<Omit<T, P> & T[P], never>

  type Test = { id: '1', myProp: { foo: '2' }}
  type Result = ExtractToObject<Test, 'myProp'> // expected to be { id: '1', foo: '2' }
`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('29650-medium-extracttoobject', () => {
  Assert.IsExtendsMutual<Result, {
    id: "1";
    foo: "2";
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    id: "1";
    foo: "2";
  }`))
})
