import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.NonNullable')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should NonNullable 1', () => {
  const T: Type.TDeferred<'NonNullable', [Type.TRef<'A'>]> = Type.NonNullable(Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'NonNullable')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// Test('Should NonNullable 2', () => {
//   const T: Type.TPromise<Type.TRef<'A'>> = Type.NonNullable(Type.Promise(Type.Ref('A')))
//   Assert.IsTrue(Type.IsPromise(T))
//   Assert.IsEqual(T.item.$ref, 'A')
// })
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should NonNullable 4', () => {
  const T: Type.TString = Type.NonNullable(Type.String())
  Assert.IsTrue(Type.IsString(T))
})
Test('Should NonNullable 5', () => {
  const T: Type.TString = Type.NonNullable(Type.Union([Type.String(), Type.Null()]))
  Assert.IsTrue(Type.IsString(T))
})
Test('Should NonNullable 6', () => {
  const T: Type.TString = Type.NonNullable(Type.Union([Type.String(), Type.Undefined()]))
  Assert.IsTrue(Type.IsString(T))
})
Test('Should NonNullable 7', () => {
  const T: Type.TString = Type.NonNullable(Type.Union([Type.String(), Type.Undefined(), Type.Null()]))
  Assert.IsTrue(Type.IsString(T))
})
Test('Should NonNullable 8', () => {
  const T: Type.TUnion<[Type.TString, Type.TNumber]> = Type.NonNullable(Type.Union([Type.String(), Type.Number(), Type.Undefined(), Type.Null()]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
