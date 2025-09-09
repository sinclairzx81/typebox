import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Number')

Test('Should Number 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsNumber(T))
})
Test('Should Number 2', () => {
  const T: Type.TNumber = Type.Script('number')
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Number 3', () => {
  const T: Type.TNumber = Type.Script('Options<number, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
