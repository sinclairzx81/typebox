import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  // -------------------------------------------------------------------------
  // Issue: type T = number extends not number ? true : false // true
  //        type T = number extends unknown ? true : false    // true
  //
  // TypeScript does not support type negation. The best TypeBox can do is
  // treat "not" as "unknown". From this standpoint, the extends assignability
  // check needs to return true for the following case to keep TypeBox aligned
  // with TypeScript static inference.
  // -------------------------------------------------------------------------
  const A = Type.Number()
  const B = Type.Not(Type.Number())
  const T = Type.Extends(A, B, Type.Literal(true), Type.Literal(false))
  Expect(T).ToStatic<true>()
}
{
  const T = Type.Not(Type.Number())
  Expect(T).ToStatic<unknown>()
}
{
  const T = Type.Not(Type.Not(Type.Number()))
  Expect(T).ToStatic<number>()
}
