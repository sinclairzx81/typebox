// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Boolean')

Test('Should not guard Boolean', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsBoolean(T))
})
Test('Should Create Boolean 1', () => {
  const T: Type.TBoolean = Type.Boolean()
  Assert.IsTrue(Type.IsBoolean(T))
})
Test('Should Create Boolean with options', () => {
  const T: Type.TBoolean = Type.Boolean({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})