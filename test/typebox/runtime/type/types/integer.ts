// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Integer')

Test('Should not guard Integer', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsInteger(T))
})
Test('Should Create Integer 1', () => {
  const T: Type.TInteger = Type.Integer()
  Assert.IsTrue(Type.IsInteger(T))
})
Test('Should Create Integer with options', () => {
  const T: Type.TInteger = Type.Integer({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})