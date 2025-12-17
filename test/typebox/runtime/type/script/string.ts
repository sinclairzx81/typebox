import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.String')

Test('Should String 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsString(T))
})
Test('Should String 2', () => {
  const T: Type.TString = Type.Script('string')
  Assert.IsTrue(Type.IsString(T))
})
Test('Should String 3', () => {
  const T: Type.TString = Type.Script('Assign<string, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
