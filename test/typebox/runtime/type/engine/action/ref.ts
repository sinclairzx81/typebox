import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Ref')

Test('Should Ref 1', () => {
  const A = Type.String()
  const R = Type.Ref('A')
  const T: Type.TString = Type.Instantiate({ A }, R)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Ref 2', () => {
  const A = Type.String()
  const R = Type.Ref('B')
  const T: Type.TRef<'B'> = Type.Instantiate({ A }, R)
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'B')
})
Test('Should Ref 3', () => {
  const A = Type.Ref('B')
  const B = Type.Ref('A')
  const T: Type.TRef<'A'> = Type.Instantiate({ A, B }, B)
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'A')
})
Test('Should Ref 4', () => {
  const A = Type.Ref('B')
  const B = Type.Ref('A')
  const T: Type.TRef<'A'> = Type.Instantiate({ A, B }, B)
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'A')
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1522
//
// Non-Instantiated Ref Must Retain Options
// ------------------------------------------------------------------
Test('Should Ref 5', () => {
  const T: Type.TRef<'A'> = Type.Ref('A', { foo: 'bar' })
  const S = Type.Instantiate({}, T) // no-target

  Assert.IsTrue(Type.IsRef(S))
  Assert.IsEqual(S.$ref, 'A')
  Assert.HasPropertyKey(S, 'foo')
  Assert.IsEqual(S.foo, 'bar')
})
Test('Should Ref 6', () => {
  const T: Type.TRef<'A'> = Type.Ref('A', { foo: 'bar' })
  const S: Type.TString = Type.Instantiate({ A: Type.String({ foo: 'baz' }) }, T)

  Assert.IsTrue(Type.IsString(S))
  Assert.HasPropertyKey(S, 'foo')
  Assert.IsEqual(S.foo, 'baz')
})
Test('Should Ref 7', () => {
  const R: Type.TRecord<'^.*$', Type.TRef<'A'>> = Type.Record(Type.String(), Type.Ref('A', { foo: 'bar' }))
  const S: Type.TRecord<'^.*$', Type.TRef<'A'>> = Type.Instantiate({}, R) // no-target
  const V: Type.TRef<'A'> = Type.RecordValue(S)

  Assert.IsTrue(Type.IsRecord(S))
  Assert.IsEqual(V.$ref, 'A')
  Assert.HasPropertyKey(V, 'foo')
  Assert.IsEqual(V.foo, 'bar')
})
Test('Should Ref 8', () => {
  const R: Type.TRecord<'^.*$', Type.TRef<'A'>> = Type.Record(Type.String(), Type.Ref('A', { foo: 'bar' }))
  const S: Type.TRecord<'^.*$', Type.TString> = Type.Instantiate({ A: Type.String({ foo: 'baz' }) }, R)
  const V: Type.TString = Type.RecordValue(S)

  Assert.IsTrue(Type.IsRecord(S))
  Assert.IsTrue(Type.IsString(V))
  Assert.HasPropertyKey(V, 'foo')
  Assert.IsEqual(V.foo, 'baz')
})
