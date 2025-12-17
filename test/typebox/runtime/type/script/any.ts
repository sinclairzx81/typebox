import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Any')

Test('Should Any 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsAny(T))
})
Test('Should Any 2', () => {
  const T: Type.TAny = Type.Script('any')
  Assert.IsTrue(Type.IsAny(T))
})
Test('Should Any 3', () => {
  const T: Type.TAny = Type.Script(`Assign<any, { a: 1, b: 2 }>`)
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
