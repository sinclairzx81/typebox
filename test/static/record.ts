import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'
{
  // type K = string
  const K = Type.String()
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>

  Expect(T).ToStatic<Record<string, number>>()
}
{
  // type K = string
  const K = Type.RegExp(/foo|bar/)
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToStatic<Record<string, number>>()
}
{
  // type K = number
  const K = Type.Number()
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToStatic<Record<number, number>>()
}
{
  // type K = 'A' | 'B' | 'C'
  const K = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToStatic<Record<'A' | 'B' | 'C', number>>()
}
{
  // type K = keyof { A: number, B: number, C: number }
  const K = Type.KeyOf(
    Type.Object({
      A: Type.Number(),
      B: Type.Number(),
      C: Type.Number(),
    }),
  )
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToStatic<Record<'A' | 'B' | 'C', number>>()
}
{
  // type K = keyof Omit<{ A: number, B: number, C: number }, 'C'>
  const K = Type.KeyOf(
    Type.Omit(
      Type.Object({
        A: Type.Number(),
        B: Type.Number(),
        C: Type.Number(),
      }),
      ['C'],
    ),
  )
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToStatic<Record<'A' | 'B', number>>()
}

{
  const T = Type.Record(Type.Number(), Type.String())

  Expect(T).ToStatic<Record<number, string>>()
}
{
  const T = Type.Record(Type.Integer(), Type.String())

  Expect(T).ToStatic<Record<number, string>>()
}
{
  // Should support enum keys 1
  enum E {
    A = 'X',
    B = 'Y',
    C = 'Z',
  }
  const T = Type.Record(Type.Enum(E), Type.Number())
  Expect(T).ToStatic<{
    X: number
    Y: number
    Z: number
  }>()
}
{
  // Should support enum keys 2
  enum E {
    A,
    B,
    C,
  }
  const T = Type.Record(Type.Enum(E), Type.Number())
  Expect(T).ToStatic<{
    0: number
    1: number
    2: number
  }>()
}
{
  // Should support enum keys 3
  enum E {
    A = 1,
    B = '2',
    C = 'Z',
  }
  const T = Type.Record(Type.Enum(E), Type.Number())
  Expect(T).ToStatic<{
    1: number
    2: number
    Z: number
  }>()
}
{
  // should support infinite record keys
  // https://github.com/sinclairzx81/typebox/issues/604
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number())
  Expect(R).ToStatic<Record<`key${number}`, number>>()
}
{
  // should support infinite record keys with intersect
  // https://github.com/sinclairzx81/typebox/issues/604
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number())
  const T = Type.Object({ x: Type.Number(), y: Type.Number() })
  const I = Type.Intersect([R, T])
  Expect(I).ToStatic<Record<`key${number}`, number> & { x: number; y: number }>()
}
{
  // expect T as Object
  enum E {
    A,
    B,
    C,
  }
  const T = Type.Record(Type.Enum(E), Type.Number())
  Expect(T).ToStatic<{
    0: number
    1: number
    2: number
  }>
}
{
  // expect T as Partial Object
  enum E {
    A,
    B,
    C,
  }
  const T = Type.Partial(Type.Record(Type.Enum(E), Type.Number()))
  Expect(T).ToStatic<{
    0?: number
    1?: number
    2?: number
  }>
}
{
  // expect T to support named properties
  enum E {
    A = 'A',
    B = 'B',
    C = 'C',
  }
  const T = Type.Record(Type.Enum(E), Type.Number())
  Expect(T).ToStatic<{
    A: number
    B: number
    C: number
  }>
}
{
  // expect T to support named properties
  enum E {}
  const T = Type.Record(Type.Enum(E), Type.Number())
  Expect(T).ToStatic<{ [x: string]: number }>
}
// ------------------------------------------------------------------
// Dollar Sign Escape
// https://github.com/sinclairzx81/typebox/issues/794
// ------------------------------------------------------------------
// prettier-ignore
{
  const K = Type.TemplateLiteral('$prop${A|B|C}') // issue
  const T = Type.Record(K, Type.String())
  Expect(T).ToStatic<{
    '$propA': string,
    '$propB': string,
    '$propC': string
  }>()
}
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/916
// ------------------------------------------------------------------
{
  const K = Type.Any()
  const T = Type.Record(K, Type.String())
  Expect(T).ToStatic<Record<string, string>>()
}
{
  const K = Type.Never()
  const T = Type.Record(K, Type.String())
  Expect(T).ToStatic<{}>()
}
// ------------------------------------------------------------------
// Deep Union
// https://github.com/sinclairzx81/typebox/issues/1208
// ------------------------------------------------------------------
// prettier-ignore
{
  const A = Type.Record(Type.Union([
    Type.Literal(0), Type.Literal(1), Type.Literal(2), Type.Literal(3), Type.Literal(4), Type.Literal(5), Type.Literal(6), Type.Literal(7),
    Type.Literal(8), Type.Literal(9), Type.Literal(10), Type.Literal(11), Type.Literal(12), Type.Literal(13), Type.Literal(14), Type.Literal(15),
    Type.Literal(16), Type.Literal(17), Type.Literal(18), Type.Literal(19), Type.Literal(20), Type.Literal(21), Type.Literal(22), Type.Literal(23),
    Type.Literal(24), Type.Literal(25), Type.Literal(26), Type.Literal(27), Type.Literal(28), Type.Literal(29), Type.Literal(30), Type.Literal(31),
    Type.Literal(32), Type.Literal(33), Type.Literal(34), Type.Literal(35), Type.Literal(36), Type.Literal(37), Type.Literal(38), Type.Literal(39),
    Type.Literal(40), Type.Literal(41), Type.Literal(42), Type.Literal(43), Type.Literal(44), Type.Literal(45), Type.Literal(46), Type.Literal(47),
    Type.Literal(48), Type.Literal(49), Type.Literal(50), Type.Literal(51), Type.Literal(52), Type.Literal(53), Type.Literal(54), Type.Literal(55),
    Type.Literal(56), Type.Literal(57), Type.Literal(58), Type.Literal(59), Type.Literal(60), Type.Literal(61), Type.Literal(62), Type.Literal(63),  // <- x64
    Type.Literal(64), Type.Literal(65), Type.Literal(66), Type.Literal(67), Type.Literal(68), Type.Literal(69), Type.Literal(70), Type.Literal(71),
    Type.Literal(72), Type.Literal(73), Type.Literal(74), Type.Literal(75), Type.Literal(76), Type.Literal(77), Type.Literal(78), Type.Literal(79),
    Type.Literal(80), Type.Literal(81), Type.Literal(82), Type.Literal(83), Type.Literal(84), Type.Literal(85), Type.Literal(86), Type.Literal(87),
    Type.Literal(88), Type.Literal(89), Type.Literal(90), Type.Literal(91), Type.Literal(92), Type.Literal(93), Type.Literal(94), Type.Literal(95),
    Type.Literal(96), Type.Literal(97), Type.Literal(98), Type.Literal(99), Type.Literal(100), Type.Literal(101), Type.Literal(102), Type.Literal(103),
    Type.Literal(104), Type.Literal(105), Type.Literal(106), Type.Literal(107), Type.Literal(108), Type.Literal(109), Type.Literal(110), Type.Literal(111),
    Type.Literal(112), Type.Literal(113), Type.Literal(114), Type.Literal(115), Type.Literal(116), Type.Literal(117), Type.Literal(118), Type.Literal(119),
    Type.Literal(120), Type.Literal(121), Type.Literal(122), Type.Literal(123), Type.Literal(124), Type.Literal(125), Type.Literal(126), Type.Literal(127), // <- x128
  ]), Type.String())
  const B = Type.Record(Type.Union([
    Type.Union([
      Type.Literal(0), Type.Literal(1), Type.Literal(2), Type.Literal(3), Type.Literal(4), Type.Literal(5), Type.Literal(6), Type.Literal(7),
      Type.Literal(8), Type.Literal(9), Type.Literal(10), Type.Literal(11), Type.Literal(12), Type.Literal(13), Type.Literal(14), Type.Literal(15),
      Type.Literal(16), Type.Literal(17), Type.Literal(18), Type.Literal(19), Type.Literal(20), Type.Literal(21), Type.Literal(22), Type.Literal(23),
      Type.Literal(24), Type.Literal(25), Type.Literal(26), Type.Literal(27), Type.Literal(28), Type.Literal(29), Type.Literal(30), Type.Literal(31),
    ]),
    Type.Union([
      Type.Literal(32), Type.Literal(33), Type.Literal(34), Type.Literal(35), Type.Literal(36), Type.Literal(37), Type.Literal(38), Type.Literal(39),
      Type.Literal(40), Type.Literal(41), Type.Literal(42), Type.Literal(43), Type.Literal(44), Type.Literal(45), Type.Literal(46), Type.Literal(47),
      Type.Literal(48), Type.Literal(49), Type.Literal(50), Type.Literal(51), Type.Literal(52), Type.Literal(53), Type.Literal(54), Type.Literal(55),
      Type.Literal(56), Type.Literal(57), Type.Literal(58), Type.Literal(59), Type.Literal(60), Type.Literal(61), Type.Literal(62), Type.Literal(63),  // <- x64
    ]),
    Type.Union([
      Type.Literal(64), Type.Literal(65), Type.Literal(66), Type.Literal(67), Type.Literal(68), Type.Literal(69), Type.Literal(70), Type.Literal(71),
      Type.Literal(72), Type.Literal(73), Type.Literal(74), Type.Literal(75), Type.Literal(76), Type.Literal(77), Type.Literal(78), Type.Literal(79),
      Type.Literal(80), Type.Literal(81), Type.Literal(82), Type.Literal(83), Type.Literal(84), Type.Literal(85), Type.Literal(86), Type.Literal(87),
      Type.Literal(88), Type.Literal(89), Type.Literal(90), Type.Literal(91), Type.Literal(92), Type.Literal(93), Type.Literal(94), Type.Literal(95),
    ]),
    Type.Union([
      Type.Literal(96), Type.Literal(97), Type.Literal(98), Type.Literal(99), Type.Literal(100), Type.Literal(101), Type.Literal(102), Type.Literal(103),
      Type.Literal(104), Type.Literal(105), Type.Literal(106), Type.Literal(107), Type.Literal(108), Type.Literal(109), Type.Literal(110), Type.Literal(111),
      Type.Literal(112), Type.Literal(113), Type.Literal(114), Type.Literal(115), Type.Literal(116), Type.Literal(117), Type.Literal(118), Type.Literal(119),
      Type.Literal(120), Type.Literal(121), Type.Literal(122), Type.Literal(123), Type.Literal(124), Type.Literal(125), Type.Literal(126), Type.Literal(127), // <- x128
    ])
  ]), Type.String())
  type A = Static<typeof A>
  Expect(B).ToStatic<A>()
}
