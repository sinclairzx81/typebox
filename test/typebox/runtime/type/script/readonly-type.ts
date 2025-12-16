import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.ReadonlyObject')

Test('Should ReadonlyObject 1', () => {
  const T: Type.TImmutable<Type.TArray<Type.TNumber>> = Type.Script('Readonly<number[]>')
  Assert.IsTrue(Type.IsImmutable(T))
  Assert.IsTrue(Type.IsArray(T))
})
Test('Should ReadonlyObject 2', () => {
  const T: Type.TImmutable<Type.TTuple<[Type.TNumber, Type.TString]>> = Type.Script('Readonly<[number, string]>')
  Assert.IsTrue(Type.IsImmutable(T))
  Assert.IsTrue(Type.IsTuple(T))
})
Test('Should ReadonlyObject 3', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TString>
  }> = Type.Script('Readonly<{ x: number, y: string }>')
  Assert.IsFalse(Type.IsImmutable(T))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
})
Test('Should ReadonlyObject 4', () => {
  const T: Type.TNumber = Type.Script('Readonly<number>')
  Assert.IsFalse(Type.IsImmutable(T))
  Assert.IsFalse(Type.IsReadonly(T))
  Assert.IsTrue(Type.IsNumber(T))
})
