import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'
{
  // type K = string
  const K = Type.String()
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>

  Expect(T).ToInfer<Record<string, number>>()
}
{
  // type K = string
  const K = Type.RegEx(/foo|bar/)
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToInfer<Record<string, number>>()
}
{
  // type K = number
  const K = Type.Number()
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToInfer<Record<string, number>>()
  Expect(T).ToInfer<Record<number, number>>()
}
{
  // type K = 'A' | 'B' | 'C'
  const K = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
  const T = Type.Record(K, Type.Number())
  type T = Static<typeof T>
  Expect(T).ToInfer<Record<'A' | 'B' | 'C', number>>()
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
  Expect(T).ToInfer<Record<'A' | 'B' | 'C', number>>()
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
  Expect(T).ToInfer<Record<'A' | 'B', number>>()
}
