// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Never')

Test('Should not guard Never', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsNever(T))
})
Test('Should Create Never 1', () => {
  const T: Type.TNever = Type.Never()
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Create Never with options', () => {
  const T: Type.TNever = Type.Never({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})