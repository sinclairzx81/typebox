import { Type, TLiteral, TUnion } from '@sinclair/typebox'
import { Expect } from './assert'

{
  const T = Type.Exclude(Type.String(), Type.String())
  Expect(T).ToBe<never>()
}
{
  const T = Type.Exclude(Type.String(), Type.Number())
  Expect(T).ToBe<string>()
}
{
  const T = Type.Exclude(Type.Union([Type.Number(), Type.String(), Type.Boolean()]), Type.Number())
  Expect(T).ToBe<boolean | string>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToBe<never>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToBe<'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Exclude(A, B)
  Expect(T).ToBe<'C' | 'B'>()
}
// ------------------------------------------------------------------------
// TemplateLiteral | Union
// ------------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])

  const T = Type.Exclude(A, B)
  Expect(T).ToBe<never>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A'), Type.Literal('B')])

  const T = Type.Exclude(A, B)
  Expect(T).ToBe<'C'>()
}
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
  const B = Type.Union([Type.Literal('A')])
  const T = Type.Exclude(A, B)
  Expect(T).ToBe<'C' | 'B'>()
}
// ------------------------------------------------------------------------
// Union | TemplateLiteral
// ------------------------------------------------------------------------
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToBe<never>()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])

  const T = Type.Exclude(A, B)
  Expect(T).ToBe<'C'>()
}
{
  const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
  const T = Type.Exclude(A, B)
  Expect(T).ToBe<'C' | 'B'>()
}
