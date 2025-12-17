import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Ref')

Test('Should Ref 1', () => {
  const T: Type.TUnknown = Type.Script('unknown')
  Assert.IsFalse(Type.IsRef(T))
})
Test('Should Ref 2', () => {
  const T: Type.TRef<'A'> = Type.Script('A')
  Assert.IsTrue(Type.IsRef(T))
})
// deferral
Test('Should Ref 3', () => {
  const T: Type.TAssignDeferred<Type.TRef<'A'>, {
    a: 1
    b: 2
  }> = Type.Script('Assign<A, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T.parameters[1], 'a')
  Assert.HasPropertyKey(T.parameters[1], 'b')
  Assert.IsEqual(T.parameters[1].a, 1)
  Assert.IsEqual(T.parameters[1].b, 2)
})
