import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.String')

Test('Should not guard String', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsString(T))
})
Test('Should Create String 1', () => {
  const T: Type.TString = Type.String()
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Create String with options', () => {
  const T: Type.TString = Type.String({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
