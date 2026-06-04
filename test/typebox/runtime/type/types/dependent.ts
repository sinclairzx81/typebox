import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Dependent')

Test('Should not guard Dependent', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsDependent(T))
})
Test('Should Dependent 1', () => {
  const T: Type.TDependent<Type.TNumber, Type.TBoolean, Type.TString> = Type.Dependent(
    Type.Number(),
    Type.Boolean(),
    Type.String()
  )
  Assert.IsTrue(Type.IsDependent(T))
  Assert.IsTrue(Type.IsNumber(T.if))
  Assert.IsTrue(Type.IsBoolean(T.then))
  Assert.IsTrue(Type.IsString(T.else))
})
Test('Should Dependent 2', () => {
  const T: Type.TDependent<Type.TNumber, Type.TBoolean, Type.TString> = Type.Dependent(
    Type.Number(),
    Type.Boolean(),
    Type.String(),
    { value: 123 }
  )
  Assert.IsTrue(Type.IsDependent(T))
  Assert.IsTrue(Type.IsNumber(T.if))
  Assert.IsTrue(Type.IsBoolean(T.then))
  Assert.IsTrue(Type.IsString(T.else))
  Assert.HasPropertyKey(T, 'value')
  Assert.IsEqual(T.value, 123)
})
