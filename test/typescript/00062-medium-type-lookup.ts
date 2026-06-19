// https://github.com/type-challenges/type-challenges/blob/main/questions/00062-medium-type-lookup/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type LookUp<U, T> = U extends {type: T} ? U : never;

  interface Cat {
    type: 'cat'
    breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
  }

  interface Dog {
    type: 'dog'
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
    color: 'brown' | 'white' | 'black'
  }

  type Result = LookUp<Cat | Dog, 'dog'> // expected to be 'Dog'

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00062-medium-type-lookup', () => {
  Assert.IsExtendsMutual<Result, {
    type: 'dog'
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
    color: 'brown' | 'white' | 'black'
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    type: 'dog';
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer';
    color: 'brown' | 'white' | 'black';
  }`))
})
