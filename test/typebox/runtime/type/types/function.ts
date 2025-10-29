import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Function')

Test('Should not guard Function', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsFunction(T))
})
Test('Should Create Function 1', () => {
  const T: Type.TFunction<[Type.TNull], Type.TNull> = Type.Function([Type.Null()], Type.Null())
  Assert.IsTrue(Type.IsFunction(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.returnType))
})
Test('Should Create Function 2 (No Rest Spread)', () => {
  const T: Type.TFunction<[Type.TNull, Type.TRest<Type.TArray<Type.TNumber>>], Type.TNull> = Type.Function([Type.Null(), Type.Rest(Type.Array(Type.Number()))], Type.Null())
  Assert.IsTrue(Type.IsFunction(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.returnType))
})
Test('Should Create Function with options', () => {
  const T: Type.TFunction<[Type.TNull], Type.TNull> = Type.Function([Type.Null()], Type.Null(), { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Function with options then extract', () => {
  const T: Type.TFunction<[Type.TNull], Type.TNull> = Type.Function([Type.Null()], Type.Null(), { a: 1, b: 2 })
  const O = Type.FunctionOptions(T)
  Assert.IsFalse(Type.IsFunction(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
