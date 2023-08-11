import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Tuple([Type.Number(), Type.String(), Type.Boolean()])

  type T = Static<typeof T>

  Expect(T).ToStatic<[number, string, boolean]>()
}
