import { Expect } from './assert'
import { Static, Type } from '@sinclair/typebox'

// prettier-ignore
{ // Generative
  const A = Type.Mapped(Type.Union([
    Type.Literal('x'),
    Type.Literal('y'),
    Type.Literal('z'),
  ]), K => Type.Number())
  Expect(A).ToStatic<{
    x: number,
    y: number,
    z: number
  }>
  const B = Type.Mapped(Type.TemplateLiteral('${0|1}${0|1}'), K => Type.Number())
  Expect(B).ToStatic<{
    '00': number,
    '01': number,
    '10': number,
    '11': number,
  }>
}
// prettier-ignore
{ // Generative Nested
const T = Type.Mapped(Type.TemplateLiteral('${a|b}'), X => 
  Type.Mapped(Type.TemplateLiteral('${c|d}'), Y => 
    Type.Mapped(Type.TemplateLiteral('${e|f}'), Z =>
      Type.Tuple([X, Y, Z])
    )
  )
)
type E = {
  [X in `${'a' | 'b'}`]: {
    [Y in `${'c' | 'd'}`]: {
      [Z in `${'e' | 'f'}`]: [X, Y, Z]
    }
  }
}
Expect(T).ToStatic<E> // ok
}
// prettier-ignore
{ // Identity
  const T = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })

  const A = Type.Mapped(Type.KeyOf(T), K => K)
  Expect(A).ToStatic<{
    x: 'x',
    y: 'y',
    z: 'z'
  }>()

  const B = Type.Mapped(Type.KeyOf(T), K => Type.Index(T, K))
  Expect(B).ToStatic<{
    x: number,
    y: string,
    z: boolean
  }>()
}
// prettier-ignore
{ // Extract
  const T = Type.Object({
    x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
  })
  const A = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Extract(Type.Index(T, K), Type.String())
  })
  Expect(A).ToStatic<{
    x: string
  }>
  const B = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Extract(Type.Index(T, K), Type.Union([
      Type.String(),
      Type.Number()
    ]))
  })
  Expect(B).ToStatic<{
    x: string | number
  }>
  const C = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Extract(Type.Index(T, K), Type.Null())
  })
  Expect(C).ToStatic<{ 
    x: never 
  }>
}
// prettier-ignore
{ // Numeric Keys
  const T = Type.Object({
    0: Type.Number(),
    1: Type.Number(),
    2: Type.Number()
  })
  const A = Type.Mapped(Type.KeyOf(T), K => Type.Index(T, K))
  Expect(A).ToStatic<{
    0: number,
    1: number,
    2: number
  }>
}
// prettier-ignore
{ // Extends
  const T = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const A = Type.Mapped(Type.KeyOf(T), K => {
    return ( 
      Type.Extends(K, Type.Literal('x'), Type.Literal(1), 
      Type.Extends(K, Type.Literal('y'), Type.Literal(2), 
      Type.Extends(K, Type.Literal('z'), Type.Literal(3), Type.Never())))
    )
  })
  Expect(A).ToStatic<{
    x: 1,
    y: 2,
    z: 3
  }>
  const B = Type.Mapped(Type.KeyOf(T), K => {
    return ( 
      Type.Extends(Type.Index(T, K), Type.Number(), Type.Literal(3), 
      Type.Extends(Type.Index(T, K), Type.String(), Type.Literal(2), 
      Type.Extends(Type.Index(T, K), Type.Boolean(), Type.Literal(1), Type.Never())))
    )
  })
  Expect(B).ToStatic<{
    x: 3,
    y: 2,
    z: 1
  }>
}
// prettier-ignore
{ // Exclude
  const T = Type.Object({
    x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
  })
  const A = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Exclude(Type.Index(T, K), Type.String())
  })
  Expect(A).ToStatic<{
    x: number | boolean
  }>
  const B = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Exclude(Type.Index(T, K), Type.Union([
      Type.String(),
      Type.Number()
    ]))
  })
  Expect(B).ToStatic<{
    x: boolean
  }>
  const C = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Exclude(Type.Index(T, K), Type.Null())
  })
  Expect(C).ToStatic<{ 
    x: string | number | boolean 
  }>
}
// prettier-ignore
{ // Non-Evaluated Indexed
  const T = Type.Object({
    x: Type.Number()
  })
  const A = Type.Mapped(Type.KeyOf(T), K => Type.Array(Type.Index(T, K)))
  Expect(A).ToStatic<{ x: number[] }>

  const B = Type.Mapped(Type.KeyOf(T), K => Type.Promise(Type.Index(T, K)))
  Expect(B).ToStatic<{ x: Promise<number> }>

  const C = Type.Mapped(Type.KeyOf(T), K => Type.Function([Type.Index(T, K)], Type.Index(T, K)))
  Expect(C).ToStatic<{ x: (x: number) => number }>

  const D = Type.Mapped(Type.KeyOf(T), K => Type.Tuple([Type.Index(T, K), Type.Index(T, K)]))
  Expect(D).ToStatic<{ x: [number, number] }>

  const E = Type.Mapped(Type.KeyOf(T), K => Type.Union([Type.Index(T, K)]))
  Expect(E).ToStatic<{ x: number }>

  const F = Type.Mapped(Type.KeyOf(T), K => Type.Intersect([Type.Index(T, K)]))
  Expect(F).ToStatic<{ x: number }>
}
// prettier-ignore
{ // Modifiers
  const T = Type.Object({
    x: Type.Optional(Type.Number()),
    y: Type.Number()
  })
  // Additive
  const A = Type.Mapped(Type.KeyOf(T), K => Type.Optional(Type.Index(T, K), true))
  Expect(A).ToStatic<{ x?: number, y?: number}>()
  // Subtractive
  const S = Type.Mapped(Type.KeyOf(T), K => Type.Optional(Type.Index(T, K), false))
  Expect(S).ToStatic<{ x: number, y: number}>()
}
// prettier-ignore
{ // Modifiers
  const T = Type.Object({
    x: Type.Readonly(Type.Number()),
    y: Type.Number()
  })
  // Additive
  const A = Type.Mapped(Type.KeyOf(T), K => Type.Readonly(Type.Index(T, K), true))
  Expect(A).ToStatic<{ readonly x: number, readonly y: number}>()
  // Subtractive
  const S = Type.Mapped(Type.KeyOf(T), K => Type.Readonly(Type.Index(T, K), false))
  Expect(S).ToStatic<{ x: number, y: number}>()
}
// ------------------------------------------------------------------
// Finite Boolean
// ------------------------------------------------------------------
{
  const T = Type.TemplateLiteral('${boolean}')
  const M = Type.Mapped(T, (K) => K)
  Expect(M).ToStatic<{
    true: 'true'
    false: 'false'
  }>
}
{
  const T = Type.TemplateLiteral('${0|1}${boolean}')
  const M = Type.Mapped(T, (K) => K)
  Expect(M).ToStatic<{
    '0true': '0true'
    '0false': '0false'
    '1true': '1true'
    '1false': '1false'
  }>
}
{
  const T = Type.TemplateLiteral('${boolean}${0|1}')
  const M = Type.Mapped(T, (K) => K)
  Expect(M).ToStatic<{
    true0: 'true0'
    false0: 'false0'
    true1: 'true1'
    false1: 'false1'
  }>
}
{
  const T = Type.TemplateLiteral([Type.Union([Type.Literal(0), Type.Literal(1)]), Type.Union([Type.Literal(0), Type.Literal(1)])])
  const M = Type.Mapped(T, (K) => K)
  Expect(M).ToStatic<{
    '00': '00'
    '01': '01'
    '10': '10'
    '11': '11'
  }>
}
{
  const T = Type.Object({
    hello: Type.Number(),
    world: Type.String(),
  })
  const M = Type.Mapped(Type.Uppercase(Type.KeyOf(T)), (K) => {
    return Type.Index(T, Type.Lowercase(K))
  })
  Expect(M).ToStatic<{
    HELLO: number
    WORLD: string
  }>
}
// ------------------------------------------------------------------
// Interior Partial
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    }),
    y: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    }),
  })
  const M = Type.Mapped(Type.KeyOf(T), (K) => {
    return Type.Partial(Type.Index(T, K))
  })
  Expect(M).ToStatic<{
    x: { x?: number; y?: number }
    y: { x?: number; y?: number }
  }>
}
// ------------------------------------------------------------------
// Interior Required
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Partial(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    ),
    y: Type.Partial(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    ),
  })
  const M = Type.Mapped(Type.KeyOf(T), (K) => {
    return Type.Required(Type.Index(T, K))
  })
  Expect(M).ToStatic<{
    x: { x: number; y: number }
    y: { x: number; y: number }
  }>
}
// ------------------------------------------------------------------
// Pick With Key
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.Object({
    x: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    y: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  })
  const M = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Pick(T, K)
  })
  Expect(M).ToStatic<{
    x: { x: { x: number; y: number; }; };
    y: { y: { x: number; y: number; }; };
  }>
}
// ------------------------------------------------------------------
// Pick With Result
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    }),
    y: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    }),
  })
  const M = Type.Mapped(Type.KeyOf(T), (K) => {
    return Type.Pick(Type.Index(T, K), ['x'])
  })
  Expect(M).ToStatic<{
    x: { x: number }
    y: { x: number }
  }>
}
// ------------------------------------------------------------------
// Omit With Key
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.Object({
    x: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    y: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  })
  const M = Type.Mapped(Type.KeyOf(T), K => {
    return Type.Omit(T, K)
  })
  Expect(M).ToStatic<{
    x: { y: { x: number; y: number; }; };
    y: { x: { x: number; y: number; }; };
  }>
}
// ------------------------------------------------------------------
// Omit With Result
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    }),
    y: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    }),
  })
  const M = Type.Mapped(Type.KeyOf(T), (K) => {
    return Type.Omit(Type.Index(T, K), ['x'])
  })
  Expect(M).ToStatic<{
    x: { y: number }
    y: { y: number }
  }>
}
// ------------------------------------------------------------------
// With Enum
// issue: https://github.com/sinclairzx81/typebox/issues/897
// ------------------------------------------------------------------
{
  enum E {
    A,
    B,
  }
  const T = Type.Object({ a: Type.Enum(E) })
  const M = Type.Mapped(Type.KeyOf(T), (K) => Type.Index(T, K))
  Expect(M).ToStatic<{ a: E }>
}
