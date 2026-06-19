// https://github.com/type-challenges/type-challenges/blob/main/questions/09160-hard-assign/README.md

import Type from 'typebox'

// // ------------------------------------------------------------------
// // Solution
// // ------------------------------------------------------------------
const { Result } = Type.Script(`

  type Properties = Record<string, unknown>

  type Assign<Target extends Properties, Origins extends Properties[]> = 
    Origins extends [infer Left, ...infer Right]
      ? Assign<Omit<Target, keyof Left> & Left, Right>
      : Evaluate<Target>


  type Target = { a: 'a', d: { hi: 'hi' } }
  type Origin1 = { a: 'a1', b: 'b'}
  type Origin2 = { b: 'b2', c: 'c' }

  type Result = Assign<Target, [Origin1, Origin2]>
`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('09160-hard-assign', () => {
  Assert.IsExtendsMutual<Result, {
    d: {
      hi: "hi";
    };
    a: "a1";
    b: "b2";
    c: "c";
  }>(true)
  // Sequence Dependent (Review)
  Assert.IsEqual(Result, Type.Script(`{
    d: {
        hi: "hi";
    };
    a: "a1";
    b: "b2";
    c: "c";
  }`))
})

