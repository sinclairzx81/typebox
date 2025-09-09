import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Constructor')

Test('Should Constructor 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsConstructor(T))
})
Test('Should Constructor 2', () => {
  const T: Type.TConstructor<[Type.TNull], Type.TNull> = Type.Script('new (x: null) => null')
  Assert.IsTrue(Type.IsConstructor(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.instanceType))
})
Test('Should Constructor 3', () => {
  const T: Type.TConstructor<[Type.TNull, Type.TRest<Type.TArray<Type.TNumber>>], Type.TNull> = Type.Script('new (x: null, ...x: number[]) => null')
  Assert.IsTrue(Type.IsConstructor(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.instanceType))
})
Test('Should Constructor 4', () => {
  const T: Type.TConstructor<[Type.TNull], Type.TNull> = Type.Script('Options<new (x: null) => null, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Constructor 5', () => {
  const T: Type.TConstructor<[Type.TNull], Type.TNull> = Type.Script('Options<new (x: null) => null, { a: 1, b: 2 }>')

  const O = Type.ConstructorOptions(T)
  Assert.IsFalse(Type.IsConstructor(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
