import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

Expect(Type.RegEx(/foo/)).ToInfer<string>()

{
  const T = Type.Required(
    Type.Object({
      A: Type.Optional(Type.String()),
      B: Type.Optional(Type.String()),
      C: Type.Optional(Type.String()),
    }),
  )

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    A: string
    B: string
    C: string
  }>()
}
{
  {
    const A = Type.Object({ type: Type.Literal('A') })
    const B = Type.Object({ type: Type.Literal('B') })
    const C = Type.Object({ type: Type.Literal('C') })
    const Union = Type.Union([A, B, C])
    const Extended = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const T = Type.Intersect([Union, Extended])

    const P = Type.Partial(T)

    Expect(P).ToInfer<
      (
        | {
            type?: 'A' | undefined
          }
        | {
            type?: 'B' | undefined
          }
        | {
            type?: 'C' | undefined
          }
      ) & {
        x?: number | undefined
        y?: number | undefined
        z?: number | undefined
      }
    >()

    const R = Type.Required(P)

    Expect(R).ToInfer<
      (
        | {
            type: 'A'
          }
        | {
            type: 'B'
          }
        | {
            type: 'C'
          }
      ) & {
        x: number
        y: number
        z: number
      }
    >()
  }
}
