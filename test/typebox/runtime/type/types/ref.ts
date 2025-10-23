import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Ref')

Test('Should not guard Ref', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsRef(T))
})
Test('Should Create Ref 1', () => {
  const T: Type.TRef<'A'> = Type.Ref('A')
  Assert.IsTrue(Type.IsRef(T))
})
Test('Should Create Ref with options', () => {
  const T: Type.TRef<'A'> = Type.Ref('A', { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
