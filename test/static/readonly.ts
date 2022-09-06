import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Object({
    A: Type.Readonly(Type.String()),
  })

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    readonly A: string
  }>()
}
