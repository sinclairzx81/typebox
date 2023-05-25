import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  // Empty
  const T = Type.TemplateLiteral([])
  Expect(T).ToInfer<''>()
}
{
  // Literal
  const T = Type.TemplateLiteral([Type.Literal('hello')])
  Expect(T).ToInfer<'hello'>()
}
{
  // And Sequence
  const T = Type.TemplateLiteral([Type.Literal('hello'), Type.Literal('world')])
  Expect(T).ToInfer<'helloworld'>()
}
{
  // And / Or Sequence
  const T = Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal('1'), Type.Literal('2')])])
  Expect(T).ToInfer<'hello1' | 'hello2'>()
}
{
  // Auxiliary Template
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('1'), Type.Literal('2')])])
  const T = Type.TemplateLiteral([Type.Literal('hello'), A])
  Expect(T).ToInfer<'hello1' | 'hello2'>()
}
{
  // String
  const T = Type.TemplateLiteral([Type.String()])
  Expect(T).ToInfer<`${string}`>()
}
{
  // Number
  const T = Type.TemplateLiteral([Type.Number()])
  Expect(T).ToInfer<`${number}`>()
}
{
  // Boolean
  const T = Type.TemplateLiteral([Type.Boolean()])
  Expect(T).ToInfer<`${boolean}`>()
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
  Expect(T).ToInfer<'hello0' | 'hello1' | 'hello2'>()
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
  Expect(T).ToInfer<'hello0' | 'helloB' | 'helloC'>()
}
{
  // Enum Object Explicit
  const A = Type.Enum(Object.freeze({ a: 'A', b: 'B' }))
  const T = Type.TemplateLiteral([Type.Literal('hello'), A])
  Expect(T).ToInfer<'helloA' | 'helloB'>()
}
