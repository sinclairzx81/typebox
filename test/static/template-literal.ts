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
// ------------------------------------------------------------------
// Dollar Sign Escape
// https://github.com/sinclairzx81/typebox/issues/794
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.TemplateLiteral('$prop${A|B|C}') // issue
  Expect(T).ToStatic<'$propA' | '$propB' | '$propC'>()
}
// prettier-ignore
{
  const T = Type.TemplateLiteral('$prop${A|B|C}x') // trailing
  Expect(T).ToStatic<'$propAx' | '$propBx' | '$propCx'>()
}
// prettier-ignore
{ 
  const T = Type.TemplateLiteral('$prop${A|B|C}x}') // non-greedy
  Expect(T).ToStatic<'$propAx}' | '$propBx}' | '$propCx}'>()
}
// prettier-ignore
{
  const T = Type.TemplateLiteral('$prop${A|B|C}x}${X|Y}') // distributive - non-greedy
  Expect(T).ToStatic<
    '$propAx}X' | '$propBx}X' | '$propCx}X' | 
    '$propAx}Y' | '$propBx}Y' | '$propCx}Y'
  >()
}
// prettier-ignore
{ 
  const T = Type.TemplateLiteral('$prop${A|B|C}x}${X|Y}x') // distributive - non-greedy - trailing
  Expect(T).ToStatic<
    '$propAx}Xx' | '$propBx}Xx' | '$propCx}Xx' | 
    '$propAx}Yx' | '$propBx}Yx' | '$propCx}Yx'
  >()
}
// ---------------------------------------------------------------------
// issue: https://github.com/sinclairzx81/typebox/issues/913
// ---------------------------------------------------------------------
{
  const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
  const B = Type.TemplateLiteral([Type.Union([Type.Literal('X'), Type.Literal('Y')])])
  const L = Type.TemplateLiteral([Type.Literal('KEY'), A, B])
  const T = Type.Mapped(L, (K) => Type.Null())
  Expect(T).ToStatic<{
    KEYAX: null
    KEYAY: null
    KEYBX: null
    KEYBY: null
  }>()
}
