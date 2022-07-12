import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

Expect(Type.RegEx(/foo/)).ToBe<string>()

{
  const T = Type.Required(
    Type.Object({
      A: Type.Optional(Type.String()),
      B: Type.Optional(Type.String()),
      C: Type.Optional(Type.String()),
    }),
  )

  type T = Static<typeof T>

  Expect(T).ToBe<{
    A: string
    B: string
    C: string
  }>()
}
