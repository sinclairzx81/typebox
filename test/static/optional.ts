import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Object({
    A: Type.Optional(Type.String()),
  })
  type T = Static<typeof T>

  Expect(T).ToStatic<{
    A?: string
  }>()
}
// Noop
// prettier-ignore
{
  const T = Type.Object({
    A: Type.Optional(Type.String(), false),
  })
  type T = Static<typeof T>

  Expect(T).ToStatic<{
    A: string
  }>()
}
// Additive
// prettier-ignore
{
  const T = Type.Object({
    A: Type.Optional(Type.String(), true),
  })
  type T = Static<typeof T>

  Expect(T).ToStatic<{
    A?: string
  }>()
}
// Subtractive
// prettier-ignore
{
  const T = Type.Object({
    A: Type.Optional(Type.Optional(Type.String()), false)
  })
  type T = Static<typeof T>

  Expect(T).ToStatic<{
    A: string
  }>()
}
