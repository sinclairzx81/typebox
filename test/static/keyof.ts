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
  Expect(K).ToInfer<'A' | 'B' | 'C'>()
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

  Expect(K).ToInfer<'A' | 'B'>()
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

  Expect(K).ToInfer<'C'>()
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
  Expect(T).ToInfer<'C'>()
}
