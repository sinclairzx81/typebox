import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Object({
    A: Type.Readonly(Type.String()),
  })

  type T = Static<typeof T>

  Expect(T).ToStatic<{
    readonly A: string
  }>()
}
// Noop
// prettier-ignore
{
  const T = Type.Object({
    A: Type.Readonly(Type.String(), false),
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
    A: Type.Readonly(Type.String(), true),
  })
  type T = Static<typeof T>

  Expect(T).ToStatic<{
    readonly A: string
  }>()
}
// Subtractive
// prettier-ignore
{
  const T = Type.Object({
    A: Type.Readonly(Type.Readonly(Type.String()), false)
  })
  type T = Static<typeof T>

  Expect(T).ToStatic<{
    A: string
  }>()
}
