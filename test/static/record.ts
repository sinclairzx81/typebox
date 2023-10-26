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
  Expect(T).ToStatic<Record<string, number>>()
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
