import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Immutable')

Test('Should not guard Immutable', () => {
  const T: Type.TArray<Type.TNull> = Type.Array(Type.Null())
  Assert.IsFalse(Type.IsImmutable(T))
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsNull(T.items))
})
Test('Should Create Immutable 1', () => {
  const T: Type.TImmutable<Type.TArray<Type.TNull>> = Type.Immutable(Type.Array(Type.Null()))
  Assert.IsTrue(Type.IsImmutable(T))
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsNull(T.items))
})
Test('Should Create Immutable and Unwrap', () => {
  const T: Type.TImmutable<Type.TArray<Type.TNull>> = Type.Immutable(Type.Array(Type.Null()))
  const U: Type.TArray<Type.TNull> = Type.ImmutableRemove(T)
  Assert.IsFalse(Type.IsImmutable(U))
  Assert.IsTrue(Type.IsArray(U))
  Assert.IsTrue(Type.IsNull(U.items))
})
