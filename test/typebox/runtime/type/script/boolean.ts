import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Boolean')

Test('Should Boolean 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsBoolean(T))
})
Test('Should Boolean 2', () => {
  const T: Type.TBoolean = Type.Script('boolean')
  Assert.IsTrue(Type.IsBoolean(T))
})
Test('Should Boolean 3', () => {
  const T: Type.TBoolean = Type.Script('Assign<boolean, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
