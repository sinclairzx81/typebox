import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const A = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const B = Type.Tuple([Type.Literal(3), Type.Literal(4)])
  const C = Type.Tuple([...Type.Rest(A), ...Type.Rest(B)])
  Expect(C).ToInfer<[1, 2, 3, 4]>()
}
{
  const A = Type.String()
  const B = Type.Tuple([Type.Literal(3), Type.Literal(4)])
  const C = Type.Tuple([...Type.Rest(A), ...Type.Rest(B)])
  Expect(C).ToInfer<[string, 3, 4]>()
}
{
  const A = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const B = Type.String()
  const C = Type.Tuple([...Type.Rest(A), ...Type.Rest(B)])
  Expect(C).ToInfer<[1, 2, string]>()
}
{
  const A = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const B = Type.Union(Type.Rest(A))
  Expect(B).ToInfer<1 | 2>()
}
{
  const A = Type.Tuple([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
  const B = Type.Intersect(Type.Rest(A))
  Expect(B).ToInfer<{ x: number } & { y: number }>()
}
{
  const A = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const B = Type.Function(Type.Rest(A), Type.Null())
  Expect(B).ToInfer<(a: 1, b: 2) => null>()
}
