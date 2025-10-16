import { Assert } from 'test'
import Type from 'typebox'

const Test = Assert.Context('Type.Script.Immutable')

Test('Should Immutable 1', () => {
  const T: Type.TImmutable<Type.TArray<Type.TNumber>> = Type.Script('readonly number[]')
  Assert.IsTrue(Type.IsImmutable(T))
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsNumber(T.items))
})
Test('Should Immutable 2', () => {
  const T: Type.TImmutable<Type.TTuple<[Type.TNumber, Type.TString]>> = Type.Script('readonly [number, string]')
  Assert.IsTrue(Type.IsImmutable(T))
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNumber(T.items[0]))
  Assert.IsTrue(Type.IsString(T.items[1]))
})
Test('Should Immutable 3', () => {
  const T: Type.TObject<{
    x: Type.TImmutable<Type.TArray<Type.TNumber>>
  }> = Type.Script(`{
    x: readonly number[]  
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsImmutable(T.properties.x))
  Assert.IsTrue(Type.IsArray(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x.items))
})
Test('Should Immutable 4', () => {
  const T: Type.TObject<{
    x: Type.TImmutable<Type.TTuple<[Type.TString, Type.TNumber]>>
  }> = Type.Script(`{
    x: readonly [string, number]
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsImmutable(T.properties.x))
  Assert.IsTrue(Type.IsTuple(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.x.items[0]))
  Assert.IsTrue(Type.IsNumber(T.properties.x.items[1]))
})
