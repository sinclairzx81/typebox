import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.ConstructorParameters')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should ConstructorParameters 1', () => {
  const A = Type.Ref('A')
  const T: Type.TDeferred<'ConstructorParameters', [Type.TRef<'A'>]> = Type.ConstructorParameters(A)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'ConstructorParameters')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should ConstructorParameters 2', () => {
  const A = Type.Constructor([
    Type.Literal(1),
    Type.Literal(2)
  ], Type.Literal(3))
  const T: Type.TTuple<[
    Type.TLiteral<1>,
    Type.TLiteral<2>
  ]> = Type.ConstructorParameters(A)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
})
Test('Should ConstructorParameters 3', () => {
  const A = Type.Constructor([
    Type.Literal(1),
    Type.Rest(Type.Tuple([
      Type.Literal(2),
      Type.Literal(3)
    ]))
  ], Type.Literal(3))
  const T: Type.TTuple<[
    Type.TLiteral<1>,
    Type.TLiteral<2>,
    Type.TLiteral<3>
  ]> = Type.ConstructorParameters(A)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
})
// ------------------------------------------------------------------
// Coverage: Not a Constructor
// ------------------------------------------------------------------
Test('Should ConstructorParameters 3', () => {
  const A = Type.Null()
  const T: Type.TNever = Type.ConstructorParameters(A)
  Assert.IsTrue(Type.IsNever(T))
})
