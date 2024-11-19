import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

// ------------------------------------------------------------------
// Enum 1
// ------------------------------------------------------------------
{
  enum Enum {
    A,
    B,
  }

  const T = Type.Module({
    T: Type.Object({
      value: Type.Enum(Enum),
    }),
  }).Import('T')

  Expect(T).ToStatic<{
    value: Enum
  }>()
}

// ------------------------------------------------------------------
// Enum 2
// ------------------------------------------------------------------
{
  const T = Type.Module({
    T: Type.Object({
      value: Type.Enum({
        x: 1,
        y: 2,
      }),
    }),
  }).Import('T')

  Expect(T).ToStatic<{
    value: 1 | 2
  }>()
}
