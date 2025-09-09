import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.ReturnType')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should ReturnType 1', () => {
  const A: Type.TRef<'A'> = Type.Ref('A')
  const T: Type.TDeferred<'ReturnType', [Type.TRef<'A'>]> = Type.ReturnType(A)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'ReturnType')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
