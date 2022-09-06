import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.String(),
  })

  const T = Type.Omit(A, ['A', 'B'])

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    C: string
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

  const T = Type.Omit(A, Type.KeyOf(B))

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    C: string
  }>()
}
