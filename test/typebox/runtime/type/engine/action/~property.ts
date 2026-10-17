import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.EvaluateProperty')

// ------------------------------------------------------------------
// EvaluatePropertyIntersect
// ------------------------------------------------------------------
Test('Should EvaluatePropertyIntersect 1', () => {
  const A = Type.Readonly(Type.Optional(Type.Number()))
  const B = Type.Readonly(Type.Number())
  const T: Type.TReadonly<Type.TNumber> = Type.EvaluatePropertyIntersect(A, B)
  Assert.IsTrue(Type.IsNumber(T))
  Assert.IsTrue(Type.IsReadonly(T))
  Assert.IsFalse(Type.IsOptional(T))
})
Test('Should EvaluatePropertyIntersect 2', () => {
  const A = Type.Readonly(Type.Optional(Type.Number()))
  const B = Type.Optional(Type.Number())
  const T: Type.TOptional<Type.TNumber> = Type.EvaluatePropertyIntersect(A, B)
  Assert.IsTrue(Type.IsNumber(T))
  Assert.IsFalse(Type.IsReadonly(T))
  Assert.IsTrue(Type.IsOptional(T))
})
Test('Should EvaluatePropertyIntersect 3', () => {
  const A = Type.Readonly(Type.Optional(Type.Number()))
  const B = Type.Number()
  const T: Type.TNumber = Type.EvaluatePropertyIntersect(A, B)
  Assert.IsTrue(Type.IsNumber(T))
  Assert.IsFalse(Type.IsReadonly(T))
  Assert.IsFalse(Type.IsOptional(T))
})
Test('Should EvaluatePropertyIntersect 4', () => {
  const A = Type.Readonly(Type.Optional(Type.Object({ a: Type.Number() })))
  const B = Type.Readonly(Type.Optional(Type.Object({ b: Type.String() })))
  const T: Type.TReadonly<
    Type.TOptional<
      Type.TObject<{
        a: Type.TNumber
        b: Type.TString
      }>
    >
  > = Type.EvaluatePropertyIntersect(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsReadonly(T))
  Assert.IsTrue(Type.IsOptional(T))
  Assert.IsTrue(Type.IsNumber(T.properties.a))
  Assert.IsTrue(Type.IsString(T.properties.b))
  Assert.IsEqual(T.required, ['a', 'b'])
})
// ------------------------------------------------------------------
// EvaluatePropertyUnion
// ------------------------------------------------------------------
Test('Should EvaluatePropertyUnion 1', () => {
  const A = Type.Readonly(Type.Number())
  const B = Type.String()
  const T: Type.TReadonly<Type.TUnion<[Type.TNumber, Type.TString]>> = Type.EvaluatePropertyUnion(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsReadonly(T))
  Assert.IsFalse(Type.IsOptional(T))
})
Test('Should EvaluatePropertyUnion 2', () => {
  const A = Type.Optional(Type.Number())
  const B = Type.String()
  const T: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TString]>> = Type.EvaluatePropertyUnion(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsFalse(Type.IsReadonly(T))
  Assert.IsTrue(Type.IsOptional(T))
})
Test('Should EvaluatePropertyUnion 3', () => {
  const A = Type.Number()
  const B = Type.String()
  const T: Type.TUnion<[Type.TNumber, Type.TString]> = Type.EvaluatePropertyUnion(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsFalse(Type.IsReadonly(T))
  Assert.IsFalse(Type.IsOptional(T))
})
Test('Should EvaluatePropertyUnion 4', () => {
  const A = Type.Optional(Type.Number())
  const B = Type.Readonly(Type.String())
  const T: Type.TReadonly<Type.TOptional<Type.TUnion<[Type.TNumber, Type.TString]>>> = Type.EvaluatePropertyUnion(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsReadonly(T))
  Assert.IsTrue(Type.IsOptional(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
  Assert.IsFalse(Type.IsReadonly(T.anyOf[0]))
  Assert.IsFalse(Type.IsOptional(T.anyOf[0]))
  Assert.IsFalse(Type.IsReadonly(T.anyOf[1]))
  Assert.IsFalse(Type.IsOptional(T.anyOf[1]))
})
