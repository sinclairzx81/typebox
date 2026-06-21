// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/05310-medium-join/README.md
//
// Implement the type version of Array.join, Join<T, U> takes an Array T, string or number U and returns 
// the Array T with U stitching up.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB, ResultC, ResultD } = Type.Script(`

  type Join<T extends string[], Sep extends string | number = '', Result extends string = ''> = 
    T extends [infer Left extends string, ...infer Right extends string[]] 
      ? Join<Right, Sep, Result extends '' ? \`\${Left}\` : \`\${Result}\${Sep}\${Left}\`>
      : Result

  type ResultA = Join<["a", "p", "p", "l", "e"], "-">;   // expected to be 'a-p-p-l-e'
  type ResultB = Join<["Hello", "World"], " ">;          // expected to be 'Hello World'
  type ResultC = Join<["2", "2", "2"], 1>;               // expected to be '21212'
  type ResultD = Join<["o"], "u">;                       // expected to be 'o'
`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>
type ResultC = Type.Static<typeof ResultC>
type ResultD = Type.Static<typeof ResultD>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('05310-medium-join', () => {
  Assert.IsExtendsMutual<ResultA, 'a-p-p-l-e'>(true)
  Assert.IsExtendsMutual<ResultB, 'Hello World'>(true)
  Assert.IsExtendsMutual<ResultC, '21212'>(true)
  Assert.IsExtendsMutual<ResultD, 'o'>(true)

  Assert.IsEqual(ResultA, Type.Script('`a-p-p-l-e`'))
  Assert.IsEqual(ResultB, Type.Script('`Hello World`'))
  Assert.IsEqual(ResultC, Type.Script('`21212`'))
  Assert.IsEqual(ResultD, Type.Script('`o`'))
})
