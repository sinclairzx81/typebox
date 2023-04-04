import { Type, TLiteral, TUnion } from '@sinclair/typebox'
import { Expect } from './assert'

{
  const T = Type.Extract(Type.String(), Type.String())
  Expect(T).ToBe<string>()
}
{
  const T = Type.Extract(Type.String(), Type.Number())
  Expect(T).ToBe<string>()
}
{
  const T = Type.Extract(Type.Union([Type.Number(), Type.String(), Type.Boolean()]), Type.Number())
  Expect(T).ToBe<number>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A' | 'B' | 'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A' | 'B'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A'>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | Union
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A' | 'B' | 'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B')])

  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A' | 'B'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A')])
  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A'>()
}
// ------------------------------------------------------------------------
// Union | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A' | 'B' | 'C'>()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A' | 'B'>()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Extract(A, B)
  Expect(T).ToBe<'A'>()
}
