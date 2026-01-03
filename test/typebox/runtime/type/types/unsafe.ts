import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Unsafe')

Test('Should not guard Any', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsUnsafe(T))
})
Test('Should Create Any 1', () => {
  const T: Type.TUnsafe = Type.Unsafe({} as unknown, { foo: 1 })
  Assert.IsTrue(Type.IsUnsafe(T))
})
Test('Should Create Any with options', () => {
  const T: Type.TUnsafe = Type.Unsafe({} as unknown, { foo: 1, a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'foo')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.foo, 1)
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
