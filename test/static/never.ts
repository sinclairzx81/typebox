import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  const T = Type.Never()
  Expect(T).ToStaticNever()
}
