import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Null')

Test('Should not guard Null', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsNull(T))
})
Test('Should Create Null', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Create Null with options', () => {
  const T: Type.TNull = Type.Null({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
