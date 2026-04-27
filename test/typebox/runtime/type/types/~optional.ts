import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Optional')

Test('Should not guard Optional', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsOptional(T))
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Create Optional 1', () => {
  const T: Type.TOptional<Type.TNull> = Type.Optional(Type.Null())
  Assert.IsTrue(Type.IsOptional(T))
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Create Optional and Unwrap', () => {
  const T: Type.TOptional<Type.TNull> = Type.Optional(Type.Null())
  const U = Type.OptionalRemove(T)
  Assert.IsFalse(Type.IsOptional(U))
  Assert.IsTrue(Type.IsNull(U))
})
