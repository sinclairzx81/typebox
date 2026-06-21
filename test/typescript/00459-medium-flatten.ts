// ------------------------------------------------------------------
// 
// https://github.com/type-challenges/type-challenges/blob/main/questions/00459-medium-flatten/README.md
//
// In this challenge, you would need to write a type that takes an array and emitted the flatten array type.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`
  type Flatten<Types extends unknown[], Result extends unknown[] = []> = 
    Types extends [infer Left, ...infer Right] 
      ? Left extends unknown[] 
        ? Flatten<[...Left, ...Right], Result> 
        : Flatten<[...Right], [...Result, Left]> 
      : Result

  type Result = Flatten<[1, 2, [3, 4], [5]]> // [1, 2, 3, 4, 5]
`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00459-medium-flatten', () => {
  Assert.IsExtendsMutual<Result, [1, 2, 3, 4, 5]>(true)

  Assert.IsEqual(Result, Type.Script('[1, 2, 3, 4, 5]'))
})
