import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.InstanceType')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should InstanceType 1', () => {
  const A: Type.TRef<'A'> = Type.Ref('A')
  const T: Type.TDeferred<'InstanceType', [Type.TRef<'A'>]> = Type.InstanceType(A)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'InstanceType')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should InstanceType 2', () => {
  const A = Type.Function([Type.String()], Type.String())
  const T: Type.TNever = Type.InstanceType(A)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should InstanceType 3', () => {
  const A = Type.Constructor([Type.String()], Type.String())
  const T: Type.TString = Type.InstanceType(A)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should InstanceType 4', () => {
  const A = Type.String()
  const T: Type.TNever = Type.InstanceType(A)
  Assert.IsTrue(Type.IsNever(T))
})
