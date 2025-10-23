import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Unknown')

Test('Should not guard Unknown', () => {
  const T: Type.TAny = Type.Any()
  Assert.IsFalse(Type.IsUnknown(T))
})
Test('Should Create Unknown 1', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsTrue(Type.IsUnknown(T))
})
Test('Should Create Unknown with options', () => {
  const T: Type.TUnknown = Type.Unknown({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
