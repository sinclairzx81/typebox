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
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should ReturnType 2', () => {
  const A = Type.Function([Type.String()], Type.String())
  const T: Type.TString = Type.ReturnType(A)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should ReturnType 3', () => {
  const A = Type.Constructor([Type.String()], Type.String())
  const T: Type.TNever = Type.ReturnType(A)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should ReturnType 4', () => {
  const A = Type.String()
  const T: Type.TNever = Type.ReturnType(A)
  Assert.IsTrue(Type.IsNever(T))
})
