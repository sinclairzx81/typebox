import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'
import * as Types from '@sinclair/typebox'
{
  const T = Type.Partial(
    Type.Object({
      A: Type.String(),
      B: Type.String(),
      C: Type.String(),
    }),
  )
  type T = Static<typeof T>

  Expect(T).ToStatic<{
    A?: string
    B?: string
    C?: string
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

    Expect(T).ToStatic<
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

    const P = Type.Partial(T)

    Expect(P).ToStatic<
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
  }
}
{
  // https://github.com/sinclairzx81/typebox/issues/655
  const T = Type.Object({
    a: Type.ReadonlyOptional(Type.Number()),
    b: Type.Readonly(Type.Number()),
    c: Type.Optional(Type.Number()),
    d: Type.Number(),
  })
  const R: Types.TObject<{
    a: Types.TReadonlyOptional<Types.TNumber>
    b: Types.TReadonlyOptional<Types.TNumber>
    c: Types.TOptional<Types.TNumber>
    d: Types.TOptional<Types.TNumber>
  }> = Type.Partial(T)
}
