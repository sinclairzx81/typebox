import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Object({
    A: Type.ReadonlyOptional(Type.String()),
  })
  Expect(T).ToInfer<{
    readonly A?: string
  }>()
}
