import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Partial(
    Type.Object({
      A: Type.String(),
      B: Type.String(),
      C: Type.String(),
    }),
  )
  type T = Static<typeof T>

  Expect(T).ToBe<{
    A?: string
    B?: string
    C?: string
  }>()
}
