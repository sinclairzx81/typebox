import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  const T = Type.Not(Type.Number(), Type.String())
  Expect(T).ToInfer<string>()
}
