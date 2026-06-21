// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/04499-medium-chunk/README.md
//
// Do you know lodash? Chunk is a very useful function in it, now let's implement it. Chunk<T, N> accepts 
// two required type parameters, the T must be a tuple, and the N must be an integer >=1
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC } = Type.Script(`

  type Chunk<T extends unknown[], N extends number,
    Current extends unknown[] = [],
    Result extends unknown[] = []
  > =
    Current['length'] extends N
      ? Chunk<T, N, [], [...Result, Current]> 
      : T extends [infer Head, ...infer Tail]
        ? Chunk<Tail, N, [...Current, Head], Result>
        : Current extends []
          ? Result
          : [...Result, Current]

  type ResultA = Chunk<[1, 2, 3], 2> // expected to be [[1, 2], [3]]
  type ResultB = Chunk<[1, 2, 3], 4> // expected to be [[1, 2, 3]]
  type ResultC = Chunk<[1, 2, 3], 1> // expected to be [[1], [2], [3]]
`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('04499-medium-chunk', () => {
  Assert.IsExtendsMutual<ResultA, [[1, 2], [3]]>(true)
  Assert.IsExtendsMutual<ResultB, [[1, 2, 3]]>(true)
  Assert.IsExtendsMutual<ResultC, [[1], [2], [3]]>(true)

  Assert.IsEqual(ResultA, Type.Script(`[[1, 2], [3]]`))
  Assert.IsEqual(ResultB, Type.Script(`[[1, 2, 3]]`))
  Assert.IsEqual(ResultC, Type.Script(`[[1], [2], [3]]`))
})
