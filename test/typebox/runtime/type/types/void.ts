import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Void')

Test('Should not guard Void', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsVoid(T))
})
Test('Should Create Void 1', () => {
  const T: Type.TVoid = Type.Void()
  Assert.IsTrue(Type.IsVoid(T))
})
Test('Should Create Void with options', () => {
  const T: Type.TVoid = Type.Void({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
