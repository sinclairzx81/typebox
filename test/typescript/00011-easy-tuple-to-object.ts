// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00011-easy-tuple-to-object/README.md
//
// Given an array, transform it into an object type and the key/value must be in the provided array.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type TupleToObject<T extends string[]> =
    T extends [infer L extends string, ...infer R extends string[]]
      ? ({ [_ in L]: L } & TupleToObject<R>)
      : {}

  type Result = Evaluate<TupleToObject<['tesla', 'model 3', 'model X', 'model Y']>>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00011-easy-tuple-to-object', () => {
  Assert.IsExtendsMutual<Result, {
    tesla: "tesla";
    "model 3": "model 3";
    "model X": "model X";
    "model Y": "model Y";
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    tesla: 'tesla';
    'model 3': 'model 3';
    'model X': 'model X';
    'model Y': 'model Y';
  }`))
})
