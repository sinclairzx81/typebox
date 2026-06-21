// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/07544-medium-construct-tuple/README.md
//
// Construct a tuple with a given length.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type ConstructTuple<L extends number, U extends unknown[] = []> = 
    U['length'] extends L
      ? U
      : ConstructTuple<L, [...U, unknown]>

  type Result = ConstructTuple<2> // expect to be [unknown, unknown]

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('07544-medium-construct-tuple', () => {
  Assert.IsExtendsMutual<Result, [unknown, unknown]>(true)

  Assert.IsEqual(Result, Type.Script(`[unknown, unknown]`))
})
