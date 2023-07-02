import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  const T = Type.Not(Type.Number())
  Expect(T).ToInfer<unknown>()
}
{
  const T = Type.Not(Type.Not(Type.Number()))
  Expect(T).ToInfer<number>()
}
