import { Expect } from './assert.js'
import { Type } from '@sinclair/typebox'

{
  const T = Type.Never()
  Expect(T).ToInfer<never>()
}
