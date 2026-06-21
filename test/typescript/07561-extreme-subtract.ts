// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/07561-extreme-subtract/README.md
//
// Implement the type Subtraction that is - in Javascript by using BuildTuple.
//
// If the minuend is less than the subtrahend, it should be never.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC } = Type.Script(`

  type ConstructTuple<L extends number, R extends unknown[] = []> = R["length"] extends L ? R : ConstructTuple<L, [...R, unknown]>

  // M => minuend, S => subtrahend
  type Subtract<M extends number, S extends number> = ConstructTuple<M> extends [...subtrahend: ConstructTuple<S>, ...rest: infer Rest] ? Rest["length"] : never

  type ResultA = Subtract<2, 1>  // expect to be 1
  type ResultB = Subtract<1, 2>  // expect to be never
  type ResultC = Subtract<4, 2>  // expect to be 2

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('07561-extreme-subtract', () => {
  Assert.IsExtendsMutual<ResultA, 1>(true)
  Assert.IsExtendsMutual<ResultB, never>(true)
  Assert.IsExtendsMutual<ResultC, 2>(true)

  Assert.IsEqual(ResultA, Type.Script(`1`))
  Assert.IsEqual(ResultB, Type.Script(`never`))
  Assert.IsEqual(ResultC, Type.Script(`2`))
})
