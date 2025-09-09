import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Lowercase')

// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
Test('Should Lowercase 1', () => {
  const T: Type.TString = Type.Uppercase(Type.String())
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Lowercase 2', () => {
  const T: Type.TLiteral<1> = Type.Uppercase(Type.Literal(1))
  Assert.IsEqual(T.const, 1)
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Lowercase 3', () => {
  const T: Type.TDeferred<'Lowercase', [Type.TRef<'A'>]> = Type.Lowercase(Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Lowercase')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Lowercase 4', () => {
  const T: Type.TLiteral<'hello'> = Type.Lowercase(Type.Literal('HELLO'))
})
Test('Should Lowercase 5', () => {
  const T: Type.TLiteral<'hello'> = Type.Lowercase(Type.Literal('HELLO'))
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 'hello')
})
Test('Should Lowercase 6', () => {
  const T: Type.TUnion<[
    Type.TLiteral<'hello'>,
    Type.TLiteral<'world'>
  ]> = Type.Lowercase(Type.Union([
    Type.Literal('HELLO'),
    Type.Literal('WORLD')
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'hello')
  Assert.IsEqual(T.anyOf[1].const, 'world')
})
Test('Should Lowercase 7', () => {
  const T: Type.TUnion<[Type.TLiteral<'hello0'>, Type.TLiteral<'hello1'>]> = Type.Lowercase(Type.TemplateLiteral('HELLO${0|1}'))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'hello0')
  Assert.IsEqual(T.anyOf[1].const, 'hello1')
})
