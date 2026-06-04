import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.With')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should With 1', () => {
  const T: Type.TWithDeferred<Type.TRef<'A'>, {
    readonly value: 123
  }> = Type.With(Type.Ref('A'), { value: 123 })
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'With')
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsEqual(T.parameters[1], { value: 123 })
})
Test('Should With 2', () => {
  const T: Type.TWithDeferred<Type.TRef<'A'>, {
    readonly value: 123
  }> = Type.With(Type.Ref('A'), { value: 123 })
  const S: Type.TWith<Type.TString, {
    readonly value: 123
  }> = Type.Instantiate({ A: Type.String() }, T)
  Assert.IsTrue(Type.IsString(S))
  Assert.IsEqual(S.value, 123)
})
Test('Should With 2', () => {
  const T: Type.TWith<Type.TString, {
    readonly value: 123
  }> = Type.With(Type.String(), { value: 123 })
  Assert.IsTrue(Type.IsString(T))
  Assert.IsEqual(T.value, 123)
})
