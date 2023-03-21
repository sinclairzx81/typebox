import { Type } from '@sinclair/typebox'
import { Expect } from './assert'

{
  const T = Type.Exclude(Type.String(), Type.String())
  Expect(T).ToBe<never>()
}
{
  const T = Type.Exclude(Type.String(), Type.Number())
  Expect(T).ToBe<string>()
}
{
  const T = Type.Exclude(Type.Union([Type.Number(), Type.String(), Type.Boolean()]), Type.Number())
  Expect(T).ToBe<boolean | string>()
}
