import { Expect } from './assert'
import { Type, TSchema } from '@sinclair/typebox'

// Asserts combinatory modifiers
{
  const T = Type.Object({
    A: Type.ReadonlyOptional(Type.String()),
    B: Type.Readonly(Type.String()),
    C: Type.Optional(Type.String()),
    D: Type.String(),
  })
  Expect(T).ToStatic<{
    readonly A?: string
    readonly B: string
    C?: string
    D: string
  }>()
}
