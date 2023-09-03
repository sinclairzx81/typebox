import { Type, TLiteral, TUnion } from '@sinclair/typebox'
import { Expect } from './assert'

{
  const T = Type.Exclude(Type.String(), Type.String())
  Expect(T).ToStaticNever()
}
{
  const T = Type.Exclude(Type.String(), Type.Number())
  Expect(T).ToStatic<string>()
}
{
  const T = Type.Exclude(Type.Union([Type.Number(), Type.String(), Type.Boolean()]), Type.Number())
  Expect(T).ToStatic<boolean | string>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToStaticNever()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToStatic<'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Exclude(A, B)
  Expect(T).ToStatic<'C' | 'B'>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | Union
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])

  const T = Type.Exclude(A, B)
  Expect(T).ToStaticNever()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B')])

  const T = Type.Exclude(A, B)
  Expect(T).ToStatic<'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A')])
  const T = Type.Exclude(A, B)
  Expect(T).ToStatic<'C' | 'B'>()
}
// ------------------------------------------------------------------------
// Union | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToStaticNever()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToStatic<'C'>()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Exclude(A, B)
  Expect(T).ToStatic<'C' | 'B'>()
}
