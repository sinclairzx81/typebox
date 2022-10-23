import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.String(),
  })

  Expect(T).ToInfer<{
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
  Expect(T).ToInfer<{
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
  const T = Type.Object({
    A: Type.Number(),
    B: Type.Number(),
    C: Type.Number(),
  }, {
    additionalProperties: Type.Boolean()
  })
  // note: the inferenced additionalProperty type does break usual structural
  // equivelence and assignment checks, but does allow for the following usage.
  function test(value: Static<typeof T>) {
    value.A = 10
    value.B = 20
    value.C = 30
    value.D = true // ok
  }
}
