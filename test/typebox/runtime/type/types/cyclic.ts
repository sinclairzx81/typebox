// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Cyclic')

// ------------------------------------------------------------------
// Guards and Instantiation
// ------------------------------------------------------------------
Test('Should Cyclic 1', () => {
  const T = Type.Cyclic({ A: Type.String() }, 'A')
  Assert.IsFalse(Type.IsAny(T))
})
Test('Should Cyclic 2', () => {
  const T = Type.Cyclic({ A: Type.String() }, 'A')
  Assert.IsTrue(Type.IsCyclic(T))
})
Test('Should Cyclic 3', () => {
  const T = Type.Cyclic({ A: Type.String() }, 'A', { a: 1, b: 2})
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Cyclic 4', () => {
  const T = Type.Cyclic({ A: Type.String() }, 'A', { a: 1, b: 2})
  const O = Type.CyclicOptions(T)
  Assert.IsFalse(Type.IsAny(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
// ------------------------------------------------------------------
// Initialize with ID
// ------------------------------------------------------------------
Test('Should Cyclic 5', () => {
  const T = Type.Cyclic({ A: Type.String() }, 'A')
  Assert.IsTrue(Type.IsCyclic(T))
  Assert.HasPropertyKey(T.$defs.A, '$id')
  Assert.IsEqual(T.$defs.A.$id, 'A')
})