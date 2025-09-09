// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Readonly')

Test('Should not guard Readonly', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsReadonly(T))
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Create Readonly 1', () => {
  const T: Type.TReadonly<Type.TNull> = Type.Readonly(Type.Null())
  Assert.IsTrue(Type.IsReadonly(T))
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Create Readonly and Unwrap', () => {
  const T: Type.TReadonly<Type.TNull> = Type.Readonly(Type.Null())
  const U = Type.ReadonlyRemove(T)
  Assert.IsFalse(Type.IsReadonly(U))
  Assert.IsTrue(Type.IsNull(U))
})