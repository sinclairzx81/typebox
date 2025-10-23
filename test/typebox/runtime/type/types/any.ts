import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Any')

Test('Should not guard Any', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsAny(T))
})
Test('Should Create Any 1', () => {
  const T: Type.TAny = Type.Any()
  Assert.IsTrue(Type.IsAny(T))
})
Test('Should Create Any with options', () => {
  const T: Type.TAny = Type.Any({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
