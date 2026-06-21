// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/28143-hard-optionalundefined/README.md
//
// Implement the util type OptionalUndefined<T, Props> that turns all the properties of T that can be undefined, 
// into optional properties. In addition, a second -optional- generic Props can be passed to restrict the properties 
// that can be altered.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA, ResultB } = Type.Script(`

  type OptionalUndefined<T, Props extends keyof T = keyof T> = Omit<
    Omit<T, Props> & {
      [K in Props as undefined extends T[K] ? K : never]?: T[K];
    } & {
      [K in Props as undefined extends T[K] ? never : K]: T[K];
    },
    never
  >;

  type ResultA =  OptionalUndefined<{ value: string | undefined, description: string }>
  // { value?: string | undefined; description: string }
  type ResultB =  OptionalUndefined<{ value: string | undefined, description: string | undefined, author: string | undefined }, 'description' | 'author'>
  // { value: string | undefined; description?: string | undefined, author?: string | undefined }

`)

type ResultA = Type.Static<typeof ResultA>
type ResultB = Type.Static<typeof ResultB>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('28143-hard-optionalundefined', () => {
  Assert.IsExtendsMutual<ResultA, { value?: string | undefined; description: string }>(true)
  Assert.IsExtendsMutual<ResultB, { value: string | undefined; description?: string | undefined, author?: string | undefined }>(true)

  Assert.IsEqual(ResultA, Type.Script(`{ value?: string | undefined; description: string }`))
  Assert.IsEqual(ResultB, Type.Script(`{ value: string | undefined; description?: string | undefined, author?: string | undefined }`))
})
