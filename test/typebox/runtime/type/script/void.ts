import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Void')

Test('Should Void 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsVoid(T))
})
Test('Should Void 2', () => {
  const T: Type.TVoid = Type.Script('void')
  Assert.IsTrue(Type.IsVoid(T))
})
Test('Should Void 3', () => {
  const T: Type.TVoid = Type.Script('Assign<void, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
