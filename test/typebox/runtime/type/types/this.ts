import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.This')

Test('Should not guard This', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsThis(T))
})
Test('Should Create This 1', () => {
  const T: Type.TThis = Type.This()
  Assert.IsTrue(Type.IsThis(T))
})
Test('Should Create This with options', () => {
  const T: Type.TThis = Type.This({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
