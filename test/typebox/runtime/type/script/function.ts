import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Function')

Test('Should Function 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsFunction(T))
})
Test('Should Function 2', () => {
  const T: Type.TFunction<[Type.TNull], Type.TNull> = Type.Script('(x: null) => null')
  Assert.IsTrue(Type.IsFunction(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.returnType))
})
Test('Should Function 3', () => {
  const T: Type.TFunction<[Type.TNull, Type.TRest<Type.TArray<Type.TNumber>>], Type.TNull> = Type.Script('(x: null, ...n: number[]) => null')
  Assert.IsTrue(Type.IsFunction(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.returnType))
})
Test('Should Function 4', () => {
  const T: Type.TFunction<[Type.TNull], Type.TNull> = Type.Script('Assign<(x: null) => null, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Function 5', () => {
  const T: Type.TFunction<[Type.TNull], Type.TNull> = Type.Script('Assign<(x: null) => null, { a: 1, b: 2 }>')
  const O = Type.FunctionOptions(T)
  Assert.IsFalse(Type.IsFunction(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
// ------------------------------------------------------------------
// Modifiers
// ------------------------------------------------------------------
Test('Should Function 6', () => {
  const T: Type.TFunction<[Type.TOptional<Type.TNull>], Type.TNull> = Type.Script('(x?: null) => null')
  Assert.IsTrue(Type.IsFunction(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsOptional(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.returnType))
})
Test('Should Function 7', () => {
  const T: Type.TFunction<[Type.TReadonly<Type.TNull>], Type.TNull> = Type.Script('( x: readonly null) => null')
  Assert.IsTrue(Type.IsFunction(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsReadonly(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.returnType))
})
Test('Should Function 8', () => {
  const T: Type.TFunction<[Type.TReadonly<Type.TOptional<Type.TNull>>], Type.TNull> = Type.Script('( x?: readonly null) => null')
  Assert.IsTrue(Type.IsFunction(T))
  Assert.IsTrue(Type.IsNull(T.parameters[0]))
  Assert.IsTrue(Type.IsOptional(T.parameters[0]))
  Assert.IsTrue(Type.IsReadonly(T.parameters[0]))
  Assert.IsTrue(Type.IsNull(T.returnType))
})
