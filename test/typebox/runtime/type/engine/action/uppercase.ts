import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Uppercase')

// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
Test('Should Uppercase 1', () => {
  const T: Type.TString = Type.Uppercase(Type.String())
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Uppercase 2', () => {
  const T: Type.TLiteral<1> = Type.Uppercase(Type.Literal(1))
  Assert.IsEqual(T.const, 1)
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Uppercase 3', () => {
  const T: Type.TDeferred<'Uppercase', [Type.TRef<'A'>]> = Type.Uppercase(Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Uppercase')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Uppercase 4', () => {
  const T: Type.TLiteral<'HELLO'> = Type.Uppercase(Type.Literal('hello'))
})
Test('Should Uppercase 5', () => {
  const T: Type.TLiteral<'HELLO'> = Type.Uppercase(Type.Literal('hello'))
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 'HELLO')
})
Test('Should Uppercase 6', () => {
  const T: Type.TUnion<[
    Type.TLiteral<'HELLO'>,
    Type.TLiteral<'WORLD'>
  ]> = Type.Uppercase(Type.Union([
    Type.Literal('hello'),
    Type.Literal('world')
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'HELLO')
  Assert.IsEqual(T.anyOf[1].const, 'WORLD')
})
Test('Should Uppercase 7', () => {
  const T: Type.TUnion<[Type.TLiteral<'HELLO0'>, Type.TLiteral<'HELLO1'>]> = Type.Uppercase(Type.TemplateLiteral('hello${0|1}'))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'HELLO0')
  Assert.IsEqual(T.anyOf[1].const, 'HELLO1')
})
