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

  const keys = ['A', 'B'] as const

  const T = Type.Omit(A, keys)

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

  Expect(T).ToInfer<
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

  const P = Type.Omit(T, ['type', 'x'])

  Expect(P).ToInfer<
    ({} | {} | {}) & {
      y: number
      z: number
    }
  >()

  const O = Type.Partial(P)

  Expect(O).ToInfer<
    ({} | {} | {}) & {
      y?: number | undefined
      z?: number | undefined
    }
  >()
}
