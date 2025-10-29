import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Array')

Test('Should not guard Array', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsArray(T))
})
Test('Should Create Array 1', () => {
  const T: Type.TArray<Type.TNull> = Type.Array(Type.Null())
  Assert.IsTrue(Type.IsArray(T))
})
Test('Should Create Array with options', () => {
  const T: Type.TArray<Type.TNull> = Type.Array(Type.Null(), { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Array with options then extract', () => {
  const T: Type.TArray<Type.TNull> = Type.Array(Type.Null(), { a: 1, b: 2 })
  const O = Type.ArrayOptions(T)
  Assert.IsFalse(Type.IsArray(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
