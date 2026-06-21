// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/27932-medium-mergeall/README.md
//
// Merge variadic number of types into a new type. If the keys overlap, its values should be merged into an union.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type MergeAll<Types extends object[], Result = {}> =
    Types extends [infer Left, ...infer Right extends object[]]
    ? MergeAll<Right, Omit<Result, keyof Left> & {
      [Key in keyof Left]: Key extends keyof Result ? Left[Key] | Result[Key] : Left[Key]
    }> : Omit<Result, never>;

  type Foo = { a: 1; b: 2 }
  type Bar = { a: 2 }
  type Baz = { c: 3 }

  type Result = MergeAll<[Foo, Bar, Baz]> // expected to be { a: 1 | 2; b: 2; c: 3 }
`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('27932-medium-mergeall', () => {
  Assert.IsExtendsMutual<Result, {
    b: 2;
    a: 2 | 1;
    c: 3;
  }>(true)
  // Order Dependence (Review)
  Assert.IsEqual(Result, Type.Script(`{
    b: 2;
    a: 2 | 1;
    c: 3;
  }`))
})
