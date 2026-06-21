// https://github.com/type-challenges/type-challenges/blob/main/questions/00459-medium-flatten/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`
  type Flatten<S extends any[], T extends any[] = []> = 
    S extends [infer X, ...infer Y] 
      ? X extends any[] 
        ? Flatten<[...X, ...Y], T> 
        : Flatten<[...Y], [...T, X]> 
      : T

  type Result = Flatten<[1, 2, [3, 4], [5]]> // [1, 2, 3, 4, 5]
`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00459-medium-flatten', () => {
  Assert.IsExtendsMutual<Result, [1, 2, 3, 4, 5]>(true)

  Assert.IsEqual(Result, Type.Script('[1, 2, 3, 4, 5]'))
})
