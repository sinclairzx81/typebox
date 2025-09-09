import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Array')

Test('Should Array 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsArray(T))
})
Test('Should Array 2', () => {
  const T: Type.TArray<Type.TNull> = Type.Script('null[]')
  Assert.IsTrue(Type.IsArray(T))
})
Test('Should Array 3', () => {
  const T: Type.TArray<Type.TNull> = Type.Script('Options<null[],  { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Array 4', () => {
  const T: Type.TArray<Type.TNull> = Type.Script('Options<null[],  { a: 1, b: 2 }>')
  const O = Type.ArrayOptions(T)
  Assert.IsFalse(Type.IsArray(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
