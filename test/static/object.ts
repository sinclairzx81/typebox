import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  const T = Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.String(),
  })

  Expect(T).ToStatic<{
    A: string
    B: string
    C: string
  }>()
}
{
  const T = Type.Object({
    A: Type.Object({
      A: Type.String(),
      B: Type.String(),
      C: Type.String(),
    }),
    B: Type.Object({
      A: Type.String(),
      B: Type.String(),
      C: Type.String(),
    }),
    C: Type.Object({
      A: Type.String(),
      B: Type.String(),
      C: Type.String(),
    }),
  })
  Expect(T).ToStatic<{
    A: {
      A: string
      B: string
      C: string
    }
    B: {
      A: string
      B: string
      C: string
    }
    C: {
      A: string
      B: string
      C: string
    }
  }>()
}
{
  const T = Type.Object(
    {
      A: Type.Number(),
      B: Type.Number(),
      C: Type.Number(),
    },
    {
      additionalProperties: Type.Boolean(),
    },
  )
  // note: Pending TypeScript support for negated types.
  Expect(T).ToStatic<{
    A: number
    B: number
    C: number
  }>()
}
