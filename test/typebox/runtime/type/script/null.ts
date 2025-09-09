import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Null')

Test('Should Null 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsNull(T))
})
Test('Should Null 2', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Null 3', () => {
  const T: Type.TNull = Type.Script('Options<null, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
