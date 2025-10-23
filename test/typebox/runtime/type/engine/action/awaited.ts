import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Awaited')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Awaited 1', () => {
  const T: Type.TDeferred<'Awaited', [Type.TRef<'A'>]> = Type.Awaited(Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Awaited')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
Test('Should Awaited 2', () => {
  const T: Type.TRef<'A'> = Type.Awaited(Type.Promise(Type.Ref('A')))
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'A')
})
Test('Should Awaited 3', () => {
  const T: Type.TRef<'A'> = Type.Awaited(Type.Promise(Type.Promise(Type.Promise(Type.Ref('A')))))
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Awaited 4', () => {
  const T: Type.TString = Type.Awaited(Type.Promise(Type.String()))
})
Test('Should Awaited 5', () => {
  const T: Type.TString = Type.Awaited(Type.Promise(Type.String()))
  Assert.IsTrue(Type.IsString(T))
})
