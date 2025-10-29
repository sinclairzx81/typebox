import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Number')

Test('Should not guard Number', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsNumber(T))
})
Test('Should Create Number 1', () => {
  const T: Type.TNumber = Type.Number()
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Create Number with options', () => {
  const T: Type.TNumber = Type.Number({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
