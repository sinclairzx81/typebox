// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00018-easy-tuple-length/README.md
//
// For given a tuple, you need create a generic Length, pick the length of the tuple
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB } = Type.Script(`
  
  type Increment<T> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16][T]

  type Length<T extends unknown[], Result extends number = 0> = (
    T extends [infer _, ...infer Right extends unknown[]] 
      ? Length<Right, Increment<Result>> 
      : Result
  )

  type tesla = ['tesla', 'model 3', 'model X', 'model Y']
  type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

  type ResultA = Length<tesla>  // expected 4
  type ResultB = Length<spaceX> // expected 5

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00018-easy-tuple-length', () => {
  Assert.IsExtendsMutual<ResultA, 4>(true)
  Assert.IsExtendsMutual<ResultB, 5>(true)

  Assert.IsEqual(ResultA, Type.Script(`4`))
  Assert.IsEqual(ResultB, Type.Script(`5`))
})
