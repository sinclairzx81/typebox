import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Symbol')

Test('Should Symbol 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsSymbol(T))
})
Test('Should Symbol 2', () => {
  const T: Type.TSymbol = Type.Script('symbol')
  Assert.IsTrue(Type.IsSymbol(T))
})
Test('Should Symbol 3', () => {
  const T: Type.TSymbol = Type.Script('Assign<symbol, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
