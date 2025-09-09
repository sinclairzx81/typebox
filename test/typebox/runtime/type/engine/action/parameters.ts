import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Parameters')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Parameters 1', () => {
  const A = Type.Ref('A')
  const T: Type.TDeferred<'Parameters', [Type.TRef<'A'>]> = Type.Parameters(A)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Parameters')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Parameters 2', () => {
  const A = Type.Function([
    Type.Literal(1),
    Type.Literal(2)
  ], Type.Literal(3))
  const T = Type.Parameters(A)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
})

Test('Should Parameters 3', () => {
  const A = Type.Function([
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
  ]> = Type.Parameters(A)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
})
// ------------------------------------------------------------------
// Coverage: Not a Function
// ------------------------------------------------------------------
Test('Should Parameters 4', () => {
  const A = Type.Null()
  const T: Type.TNever = Type.Parameters(A)
  Assert.IsTrue(Type.IsNever(T))
})
