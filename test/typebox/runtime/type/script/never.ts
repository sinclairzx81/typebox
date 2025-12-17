import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Never')

Test('Should Never 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsNever(T))
})
Test('Should Never 2', () => {
  const T: Type.TNever = Type.Script('never')
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Never 3', () => {
  const T: Type.TNever = Type.Script('Assign<never, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
