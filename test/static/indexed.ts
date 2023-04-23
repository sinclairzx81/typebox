import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Object({
    x: Type.Number(),
    y: Type.String(),
  })
  const I = Type.Index(T, ['x', 'y'])
  Expect(I).ToInfer<number | string>()
}
{
  const T = Type.Tuple([Type.Number(), Type.String(), Type.Boolean()])
  const I = Type.Index(T, Type.Union([Type.Literal('0'), Type.Literal('1')]))
  Expect(I).ToInfer<number | string>()
}
{
  const T = Type.Tuple([Type.Number(), Type.String(), Type.Boolean()])
  const I = Type.Index(T, Type.Union([Type.Literal(0), Type.Literal(1)]))
  Expect(I).ToInfer<number | string>()
}
{
  const T = Type.Object({
    ab: Type.Number(),
    ac: Type.String(),
  })
  const I = Type.Index(T, Type.TemplateLiteral([Type.Literal('a'), Type.Union([Type.Literal('b'), Type.Literal('c')])]))
  Expect(I).ToInfer<number | string>()
}
{
  const A = Type.Tuple([Type.String(), Type.Boolean()])

  const R = Type.Index(A, Type.Number())

  Expect(R).ToInfer<string | boolean>()
}
{
  const A = Type.Tuple([Type.String()])

  const R = Type.Index(A, Type.Number())

  Expect(R).ToInfer<string>()
}
{
  const A = Type.Tuple([])

  const R = Type.Index(A, Type.Number())

  Expect(R).ToInfer<never>()
}
{
  const A = Type.Object({})

  const R = Type.Index(A, Type.BigInt()) // Support Overload

  Expect(R).ToInfer<never>()
}
{
  const A = Type.Array(Type.Number())

  const R = Type.Index(A, Type.BigInt()) // Support Overload

  Expect(R).ToInfer<never>()
}
