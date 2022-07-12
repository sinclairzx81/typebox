import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Pick(
    Type.Object({
      A: Type.String(),
      B: Type.String(),
      C: Type.String(),
    }),
    ['C'],
  )

  type T = Static<typeof T>

  Expect(T).ToBe<{
    C: string
  }>()
}
