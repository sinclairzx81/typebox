import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
  })
  const B = Type.Object({
    A: Type.Number(),
    B: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToInfer<{
    A: never
    B: never
  }>()
}
