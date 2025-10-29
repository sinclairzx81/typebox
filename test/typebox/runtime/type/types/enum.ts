import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Enum')

Test('Should not guard Enum', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsEnum(T))
})
Test('Should Create Enum 1', () => {
  const T: Type.TEnum<[1, 'hello', null]> = Type.Enum([1, 'hello', null])
  Assert.IsTrue(Type.IsEnum(T))
})
Test('Should Create Enum with options', () => {
  const T: Type.TEnum<[1, 'hello', null]> = Type.Enum([1, 'hello', null], { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
