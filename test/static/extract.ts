import { Type, TLiteral, TUnion } from '@sinclair/typebox'
import { Expect } from './assert'

{
  const T = Type.Extract(Type.String(), Type.String())
  Expect(T).ToStatic<string>()
}
{
  const T = Type.Extract(Type.String(), Type.Number())
  Expect(T).ToStaticNever()
}
{
  const T = Type.Extract(Type.Union([Type.Number(), Type.String(), Type.Boolean()]), Type.Number())
  Expect(T).ToStatic<number>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A' | 'B' | 'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A' | 'B'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A'>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | Union
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A' | 'B' | 'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B')])

  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A' | 'B'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A')])
  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A'>()
}
// ------------------------------------------------------------------------
// Union | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A' | 'B' | 'C'>()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A' | 'B'>()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Extract(A, B)
  Expect(T).ToStatic<'A'>()
}
// ------------------------------------------------------------------------
// Nested (Inference Test)
// ------------------------------------------------------------------------
{
  const U = Type.Union([Type.Literal('A'), Type.Literal('B')])
  const T = Type.Object({
    type: Type.Extract(U, Type.Literal('A')),
  })
  Expect(T).ToStatic<{ type: 'A' }>()
}
{
  const U = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const T = Type.Object({
    type: Type.Extract(U, Type.Union([Type.Literal('A'), Type.Literal('B')])),
  })
  Expect(T).ToStatic<{ type: 'A' | 'B' }>()
}
