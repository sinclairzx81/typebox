import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Integer')

Test('Should Integer 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsInteger(T))
})
Test('Should Integer 2', () => {
  const T: Type.TInteger = Type.Script('integer')
  Assert.IsTrue(Type.IsInteger(T))
})
Test('Should Integer 3', () => {
  const T: Type.TInteger = Type.Script('Options<integer, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
