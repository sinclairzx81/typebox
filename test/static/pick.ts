import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.String(),
  })

  const T = Type.Pick(A, ['A', 'B'])

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    A: string
    B: string
  }>()
}

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.String(),
  })
  const B = Type.Object({
    A: Type.String(),
    B: Type.String(),
  })

  const T = Type.Pick(A, Type.KeyOf(B))

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    A: string
    B: string
  }>()
}
