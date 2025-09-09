import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Undefined')

Test('Should Undefined 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsUndefined(T))
})
Test('Should Undefined 2', () => {
  const T: Type.TUndefined = Type.Script('undefined')
  Assert.IsTrue(Type.IsUndefined(T))
})
Test('Should Undefined 3', () => {
  const T: Type.TUndefined = Type.Script('Options<undefined, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
