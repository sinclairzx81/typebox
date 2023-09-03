import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  // expect all variants
  enum E {
    A,
    B = 'hello',
    C = 42,
  }
  const T = Type.Enum(E)
  Expect(T).ToStatic<E.A | E.B | E.C>()
}
{
  // expect all variants
  const T = Type.Enum({
    A: 1,
    B: 2,
    C: 3,
  })
  Expect(T).ToStatic<1 | 2 | 3>()
}
{
  // expect variant overlap to reduce
  const T = Type.Enum({
    A: 1,
    B: 2,
    C: 2, // overlap
  })
  Expect(T).ToStatic<1 | 2>()
}
{
  // expect empty enum to be never
  enum E {}
  const T = Type.Enum(E)
  Expect(T).ToStaticNever()
}
{
  // expect empty enum to be never
  const T = Type.Enum({})
  Expect(T).ToStaticNever()
}
