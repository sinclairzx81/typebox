import { Type } from '@sinclair/typebox'
import { Expect } from './assert'

{
  const T = Type.Extract(Type.String(), Type.String())
  Expect(T).ToBe<string>()
}
{
  const T = Type.Extract(Type.String(), Type.Number())
  Expect(T).ToBe<never>()
}
{
  const T = Type.Extract(Type.Union([Type.Number(), Type.String(), Type.Boolean()]), Type.Number())
  Expect(T).ToBe<number>()
}
