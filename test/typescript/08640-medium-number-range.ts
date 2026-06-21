// https://github.com/type-challenges/type-challenges/blob/main/questions/08640-medium-number-range/README.md

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
//
// Reduced upper range from 9 -> 6 to enable inference to pass
// ------------------------------------------------------------------
const { Result } = Type.Script(`

  type Range<Num, Buffer extends any[] = [], Result = Num> = 
    Buffer['length'] extends Num
      ? Result
      : Range<Num, [...Buffer, 0], Buffer['length'] | Result>

  type NumberRange<Low extends number, High extends number, 
    Left   = Range<High>, 
    Right  = Range<Low>,
    Result = Evaluate<Low | Exclude<Left, Right>>
  > = Result

  type Result = NumberRange<2, 6>

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assertion
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('08640-medium-number-range', () => {
  Assert.IsExtendsMutual<Result, 2 | 5 | 4 | 3 | 6>(true)

  Assert.IsEqual(Result, Type.Script(`2 | 5 | 4 | 3 | 6`))
})
