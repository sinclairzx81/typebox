import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.String({ $id: 'T' })
  const R = Type.Ref('T')

  type T = Static<typeof T>
  type R = Static<typeof R>

  Expect(T).ToStatic<string>()
  Expect(R).ToStatic<unknown>()
}
