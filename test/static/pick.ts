import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.String(),
  })

  const T = Type.Pick(A, ['A', 'B'])

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    A: string
    B: string
  }>()
}

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.String(),
  })

  const keys = ['A', 'B'] as const

  const T = Type.Pick(A, keys)

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    A: string
    B: string
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

  const T = Type.Pick(A, Type.KeyOf(B))

  type T = Static<typeof T>

  Expect(T).ToInfer<{
    A: string
    B: string
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

  const K = Type.KeyOf(T)

  Expect(K).ToInfer<'type' | 'x' | 'y' | 'z'>()

  const P = Type.Pick(T, ['type', 'x'])

  Expect(P).ToInfer<
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
    }
  >()

  const O = Type.Partial(P)

  Expect(O).ToInfer<
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
    }
  >()
}
