// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Symbol')

Test('Should not guard Symbol', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsSymbol(T))
})
Test('Should Create Symbol 1', () => {
  const T: Type.TSymbol = Type.Symbol()
  Assert.IsTrue(Type.IsSymbol(T))
})
Test('Should Create Symbol with options', () => {
  const T: Type.TSymbol = Type.Symbol({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})