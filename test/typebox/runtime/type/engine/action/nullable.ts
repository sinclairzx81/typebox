import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Nullable')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Nullable 1', () => {
  const T: Type.TDeferred<'Nullable', [Type.TRef<'A'>]> = Type.Nullable(Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Nullable')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Nullable 2', () => {
  const T: Type.TUnion<[Type.TString, Type.TNull]> = Type.Nullable(Type.String())
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNull(T.anyOf[1]))
})
Test('Should Nullable 3', () => {
  const T: Type.TUnion<[Type.TNumber, Type.TNull]> = Type.Nullable(Type.Number())
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsNull(T.anyOf[1]))
})
Test('Should Nullable 4', () => {
  const T: Type.TUnion<[Type.TBoolean, Type.TNull]> = Type.Nullable(Type.Boolean())
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[0]))
  Assert.IsTrue(Type.IsNull(T.anyOf[1]))
})
Test('Should Nullable 5', () => {
  const T: Type.TUnion<[Type.TNull, Type.TNull]> = Type.Nullable(Type.Null())
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNull(T.anyOf[0]))
  Assert.IsTrue(Type.IsNull(T.anyOf[1]))
})
