import Type from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Immutable')

// ------------------------------------------------------------------
// Array Extends Rules
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  type A = (readonly number[]) extends (readonly number[]) ? true : false
  type B = (number[]) extends (readonly number[]) ? true : false
  type C = (readonly number[]) extends (number[]) ? true : false
  type D = (number[]) extends (number[]) ? true : false
  Assert.IsExtendsMutual<A, true>(true)
  Assert.IsExtendsMutual<B, true>(true)
  Assert.IsExtendsMutual<C, true>(false)
  Assert.IsExtendsMutual<D, true>(true)
  const { A, B, C, D } = Type.Script(`
    type A = (readonly number[]) extends (readonly number[]) ? true : false
    type B = (number[]) extends (readonly number[]) ? true : false
    type C = (readonly number[]) extends (number[]) ? true : false
    type D = (number[]) extends (number[]) ? true : false
  `)
  Assert.IsTrue(A.const)
  Assert.IsTrue(B.const)
  Assert.IsFalse(C.const)
  Assert.IsTrue(D.const)
})
