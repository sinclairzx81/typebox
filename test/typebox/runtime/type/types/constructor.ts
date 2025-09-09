// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Constructor')

Test('Should not guard Constructor', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsConstructor(T))
})
Test('Should Create Constructor 1', () => {
  const T: Type.TConstructor<[Type.TNull], Type.TNull> = 
    Type.Constructor([Type.Null()], Type.Null())
  Assert.IsTrue(Type.IsConstructor(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.instanceType))
})
Test('Should Create Constructor 2 (No Rest Spread)', () => {
  const T: Type.TConstructor<[Type.TNull, Type.TRest<Type.TArray<Type.TNumber>>], Type.TNull> = 
    Type.Constructor([Type.Null(), Type.Rest(Type.Array(Type.Number()))], Type.Null())
  Assert.IsTrue(Type.IsConstructor(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.instanceType))
})
Test('Should Create Constructor with options', () => {
  const T: Type.TConstructor<[Type.TNull], Type.TNull> = 
    Type.Constructor([Type.Null()], Type.Null(), { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Constructor with options then extract', () => {
  const T: Type.TConstructor<[Type.TNull], Type.TNull> = 
    Type.Constructor([Type.Null()], Type.Null(), { a: 1, b: 2 })
  const O = Type.ConstructorOptions(T)
  Assert.IsFalse(Type.IsConstructor(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})