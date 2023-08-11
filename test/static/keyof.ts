import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  const K = Type.KeyOf(
    Type.Object({
      A: Type.Null(),
      B: Type.Null(),
      C: Type.Null(),
    }),
  )
  Expect(K).ToStatic<'A' | 'B' | 'C'>()
}

{
  const T = Type.Pick(
    Type.Object({
      A: Type.Null(),
      B: Type.Null(),
      C: Type.Null(),
    }),
    ['A', 'B'],
  )

  const K = Type.KeyOf(T)

  Expect(K).ToStatic<'A' | 'B'>()
}

{
  const T = Type.Omit(
    Type.Object({
      A: Type.Null(),
      B: Type.Null(),
      C: Type.Null(),
    }),
    ['A', 'B'],
  )

  const K = Type.KeyOf(T)

  Expect(K).ToStatic<'C'>()
}

{
  const T = Type.KeyOf(
    Type.Omit(
      Type.Object({
        A: Type.Null(),
        B: Type.Null(),
        C: Type.Null(),
      }),
      ['A', 'B'],
    ),
  )
  Expect(T).ToStatic<'C'>()
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

    const K1 = Type.KeyOf(T)

    Expect(K1).ToStatic<'type' | 'x' | 'y' | 'z'>()

    const P = Type.Omit(T, ['type', 'x'])

    const K2 = Type.KeyOf(P)

    Expect(K2).ToStatic<'y' | 'z'>()
  }
}
{
  const T = Type.Recursive((Self) =>
    Type.Object({
      a: Type.String(),
      b: Type.String(),
      c: Type.String(),
      d: Type.Array(Self),
    }),
  )
  const K = Type.KeyOf(T)
  Expect(K).ToStatic<'a' | 'b' | 'c' | 'd'>()
}
{
  const T = Type.Object({
    a: Type.Optional(Type.String()),
    b: Type.Optional(Type.String()),
    c: Type.Optional(Type.String()),
  })
  const K = Type.KeyOf(T)
  Expect(K).ToStatic<'a' | 'b' | 'c'>()
}
