import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const A = Type.String()
  const B = Type.Number()
  const T = Type.Union([A, B])

  type T = Static<typeof T>

  Expect(T).ToStatic<string | number>()
}
{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
  })
  const B = Type.Object({
    X: Type.Number(),
    Y: Type.Number(),
  })
  const T = Type.Union([A, B])

  type T = Static<typeof T>

  Expect(T).ToStatic<
    | {
        A: string
        B: string
      }
    | {
        X: number
        Y: number
      }
  >()
}

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
  })
  const B = Type.Object({
    X: Type.Number(),
    Y: Type.Number(),
  })
  const T = Type.Union([A, B, Type.Intersect([A, B])])

  type T = Static<typeof T>

  Expect(T).ToStatic<
    | {
        A: string
        B: string
      }
    | {
        X: number
        Y: number
      }
    | ({
        A: string
        B: string
      } & {
        X: number
        Y: number
      })
  >()
}

{
  const T = Type.Union([])
  Expect(T).ToStaticNever()
}
