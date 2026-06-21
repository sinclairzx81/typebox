// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/30301-medium-isodd/README.md
//
// Return true is a number is odd
//
// ------------------------------------------------------------------

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
`)
const { ResultA, ResultB } = Type.Script(Utility, `

  type Check<Items extends unknown[], Result = false> = 
    Items extends [infer Left extends unknown, ...infer Right extends unknown[]]
      ? Check<Right, Result extends false ? true : false>
      : Result

  type IsOdd<T, Items extends unknown[] = BuildTuple<T>> = Check<Items>

  type ResultA = IsOdd<4>
  type ResultB = IsOdd<5>

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('30301-medium-isodd', () => {
  Assert.IsExtendsMutual<ResultA, false>(true)
  Assert.IsExtendsMutual<ResultB, true>(true)

  Assert.IsEqual(ResultA, Type.Script(`false`))
  Assert.IsEqual(ResultB, Type.Script(`true`))
})
