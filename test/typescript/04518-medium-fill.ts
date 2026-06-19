// https://github.com/type-challenges/type-challenges/blob/main/questions/04518-medium-fill/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const Utility = Type.Script(`
  type BuildTuple<Size extends number, Tuple extends unknown[] = []> = (
    Tuple['length'] extends Size 
      ? Tuple 
      : BuildTuple<Size, [...Tuple, unknown]>
  )
  export type LessThan<Left extends number, Right extends number> = Left extends Right ? false
    : BuildTuple<Left> extends [...BuildTuple<Right>, ...infer _Rest] ? false
    : true
  export type LessThanEqual<Left extends number, Right extends number> = (
    Left extends Right ? true : LessThan<Left, Right>
  )
  export type GreaterThan<Left extends number, Right extends number> = (
    LessThan<Right, Left>
  )
  export type GreaterThanEqual<Left extends number, Right extends number> = (
    LessThanEqual<Right, Left>
  )
`)
const { ResultA, ResultB, ResultC, ResultD } = Type.Script(Utility, `
  type Fill<T extends unknown[], N, Start extends number = 0, End extends number = T['length'], Result extends unknown[] = [],
    Min extends boolean = GreaterThanEqual<Result['length'], Start>,
    Max extends boolean = LessThan<Result['length'], End>,
    InRange extends boolean = true extends (Min & Max) ? true : false
  > = T extends [infer Left, ...infer Right]
    ? InRange extends true
      ? Fill<Right, N, Start, End, [...Result, N]>
      : Fill<Right, N, Start, End, [...Result, Left]>
    : Result

    type ResultA = Fill<[1, 2, 3], 0>       // [0, 0, 0]
    type ResultB = Fill<[1, 2, 3], 0, 1>    // [1, 0, 0]
    type ResultC = Fill<[1, 2, 3], 0, 1, 2> // [1, 0, 3]
    type ResultD = Fill<[1, 2, 3], 0, 0, 0> // [1, 2, 3]
`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>
type ResultD = Type.Static<typeof ResultD>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('04518-medium-fill', () => {
  Assert.IsExtendsMutual<ResultA, [0, 0, 0]>(true)
  Assert.IsExtendsMutual<ResultB, [1, 0, 0]>(true)
  Assert.IsExtendsMutual<ResultC, [1, 0, 3]>(true)
  Assert.IsExtendsMutual<ResultD, [1, 2, 3]>(true)

  Assert.IsEqual(ResultA, Type.Script(`[0, 0, 0]`))
  Assert.IsEqual(ResultB, Type.Script(`[1, 0, 0]`))
  Assert.IsEqual(ResultC, Type.Script(`[1, 0, 3]`))
  Assert.IsEqual(ResultD, Type.Script(`[1, 2, 3]`))
})


