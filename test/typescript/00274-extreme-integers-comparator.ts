// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00274-extreme-integers-comparator/README.md
//
// Implement a type-level integers comparator. We've provided an enum for indicating the comparison result, like this:
//
// - If a is greater than b, type should be Comparison.Greater.
// - If a and b are equal, type should be Comparison.Equal.
// - If a is lower than b, type should be Comparison.Lower.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC } = Type.Script(`

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

  type Comparator<Left extends number, Right extends number> = 
    GreaterThan<Left, Right> extends true ? 'Greater' :
    LessThan<Left, Right> extends true ? 'Lower' :
    'Equal'

  type ResultA = Comparator<1, 2>
  type ResultB = Comparator<2, 1>
  type ResultC = Comparator<2, 2>

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('test', () => {
  Assert.IsExtendsMutual<ResultA, 'Lower'>(true)
  Assert.IsExtendsMutual<ResultB, 'Greater'>(true)
  Assert.IsExtendsMutual<ResultC, 'Equal'>(true)

  Assert.IsEqual(ResultA, Type.Script(`'Lower'`))
  Assert.IsEqual(ResultB, Type.Script(`'Greater'`))
  Assert.IsEqual(ResultC, Type.Script(`'Equal'`))
})
