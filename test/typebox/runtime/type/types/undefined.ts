// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Undefined')

Test('Should not guard Undefined', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsUndefined(T))
})
Test('Should Create Undefined 1', () => {
  const T: Type.TUndefined = Type.Undefined()
  Assert.IsTrue(Type.IsUndefined(T))
})
Test('Should Create Undefined with options', () => {
  const T: Type.TUndefined = Type.Undefined({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})