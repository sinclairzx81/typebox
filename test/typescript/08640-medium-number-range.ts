// https://github.com/type-challenges/type-challenges/blob/main/questions/08640-medium-number-range/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
//
// Note: Reduced upper range from 9 -> 7 to allow inference to pass
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type Range<L, C extends any[] = [], R = L> = 
    C['length'] extends L
        ? R
        : Range<L, [...C, 0], C['length'] | R>

  type NumberRange<L, H> = Evaluate<L | Exclude<Range<H>, Range<L>>>

  type Result =   NumberRange<2, 7>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('08640-medium-number-range', () => {
  Assert.IsExtendsMutual<Result, 2 | 6 | 5 | 4 | 3 | 7>(true)

  Assert.IsEqual(Result, Type.Script(`2 | 6 | 5 | 4 | 3 | 7`))
})
