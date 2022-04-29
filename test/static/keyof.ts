import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  const K = Type.KeyOf(
    Type.Object({
      A: Type.Null(),
      B: Type.Null(),
      C: Type.Null(),
    }),
  )
  Expect(K).ToBe<'A' | 'B' | 'C'>()
}

{
  const T = Type.Pick(
    Type.Object({
      A: Type.Null(),
      B: Type.Null(),
      C: Type.Null(),
    }),
    ['A', 'B'],
  )

  const K = Type.KeyOf(T)

  Expect(K).ToBe<'A' | 'B'>()
}

{
  const T = Type.Omit(
    Type.Object({
      A: Type.Null(),
      B: Type.Null(),
      C: Type.Null(),
    }),
    ['A', 'B'],
  )

  const K = Type.KeyOf(T)

  Expect(K).ToBe<'C'>()
}

{
  const T = Type.KeyOf(
    Type.Omit(
      Type.Object({
        A: Type.Null(),
        B: Type.Null(),
        C: Type.Null(),
      }),
      ['A', 'B'],
    ),
  )
  Expect(T).ToBe<'C'>()
}
