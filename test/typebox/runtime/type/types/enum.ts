import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Enum')

// ------------------------------------------------------------------
// EnumValue
// ------------------------------------------------------------------
Test('Should not guard EnumValue', () => {
  Assert.IsFalse(Type.IsEnumValue(null))
})
Test('Should not guard EnumValue', () => {
  Assert.IsTrue(Type.IsEnumValue('hello'))
})
Test('Should not guard EnumValue', () => {
  Assert.IsTrue(Type.IsEnumValue(12345))
})
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
Test('Should not guard Enum', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsEnum(T))
})
Test('Should Create Enum 1', () => {
  const T: Type.TEnum<[1, 'hello']> = Type.Enum([1, 'hello'])
  Assert.IsTrue(Type.IsEnum(T))
})
Test('Should Create Enum with options', () => {
  const T: Type.TEnum<[1, 'hello']> = Type.Enum([1, 'hello'], { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
