import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  // Empty
  const T = Type.TemplateLiteral([])
  Expect(T).ToStatic<''>()
}
{
  // Literal
  const T = Type.TemplateLiteral([Type.Literal('hello')])
  Expect(T).ToStatic<'hello'>()
}
{
  // And Sequence
  const T = Type.TemplateLiteral([Type.Literal('hello'), Type.Literal('world')])
  Expect(T).ToStatic<'helloworld'>()
}
{
  // And / Or Sequence
  const T = Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal('1'), Type.Literal('2')])])
  Expect(T).ToStatic<'hello1' | 'hello2'>()
}
{
  // Auxiliary Template
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('1'), Type.Literal('2')])])
  const T = Type.TemplateLiteral([Type.Literal('hello'), A])
  Expect(T).ToStatic<'hello1' | 'hello2'>()
}
{
  // TemplateLiteral Composition
  const A = Type.TemplateLiteral('${A|B}')
  const B = Type.TemplateLiteral('${C|D}')
  const T = Type.TemplateLiteral([A, B])
  Expect(T).ToStatic<'AC' | 'AD' | 'BC' | 'BD'>()
}
{
  // String
  const T = Type.TemplateLiteral([Type.String()])
  Expect(T).ToStatic<`${string}`>()
}
{
  // Number
  const T = Type.TemplateLiteral([Type.Number()])
  Expect(T).ToStatic<`${number}`>()
}
{
  // Boolean
  const T = Type.TemplateLiteral([Type.Boolean()])
  Expect(T).ToStatic<`${boolean}`>()
}
{
  // Enum Implicit
  enum E {
    A,
    B,
    C,
  }
  const A = Type.Enum(E)
  const T = Type.TemplateLiteral([Type.Literal('hello'), A])
  Expect(T).ToStatic<'hello0' | 'hello1' | 'hello2'>()
}
{
  // Enum Explicit
  enum E {
    A,
    B = 'B',
    C = 'C',
  }
  const A = Type.Enum(E)
  const T = Type.TemplateLiteral([Type.Literal('hello'), A])
  Expect(T).ToStatic<'hello0' | 'helloB' | 'helloC'>()
}
{
  // Enum Object Explicit
  const A = Type.Enum(Object.freeze({ a: 'A', b: 'B' }))
  const T = Type.TemplateLiteral([Type.Literal('hello'), A])
  Expect(T).ToStatic<'helloA' | 'helloB'>()
}
