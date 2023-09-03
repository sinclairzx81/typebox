import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'
{
  // union never
  const A = Type.String()
  const B = Type.Union(Type.Rest(A))
  Expect(B).ToStaticNever()
}
{
  // intersect never
  const A = Type.String()
  const B = Type.Intersect(Type.Rest(A))
  Expect(B).ToStaticNever()
}
{
  // tuple
  const A = Type.Tuple([Type.Number(), Type.String()])
  const B = Type.Union(Type.Rest(A))
  Expect(B).ToStatic<string | number>()
}
{
  // tuple spread
  const A = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const B = Type.Tuple([Type.Literal(3), Type.Literal(4)])
  const C = Type.Tuple([...Type.Rest(A), ...Type.Rest(B)])
  Expect(C).ToStatic<[1, 2, 3, 4]>()
}
{
  // union to intersect
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.String() })
  const C = Type.Union([A, B])
  const D = Type.Intersect(Type.Rest(C))
  Expect(D).ToStatic<
    {
      x: number
    } & {
      y: string
    }
  >()
}
{
  // intersect to composite
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.String() })
  const C = Type.Intersect([A, B])
  const D = Type.Composite(Type.Rest(C))
  Expect(D).ToStatic<{
    x: number
    y: string
  }>()
}
