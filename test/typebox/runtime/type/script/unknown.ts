import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Unknown')

Test('Should Unknown 1', () => {
  const T: Type.TAny = Type.Script('any')
  Assert.IsFalse(Type.IsUnknown(T))
})
Test('Should Unknown 2', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsTrue(Type.IsUnknown(T))
})
Test('Should Unknown 3', () => {
  const T: Type.TUnknown = Type.Script('Assign<unknown, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
