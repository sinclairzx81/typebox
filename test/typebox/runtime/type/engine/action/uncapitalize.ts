import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Uncapitalize')

// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
Test('Should Uncapitalize 1', () => {
  const T: Type.TString = Type.Uppercase(Type.String())
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Uncapitalize 2', () => {
  const T: Type.TLiteral<1> = Type.Uppercase(Type.Literal(1))
  Assert.IsEqual(T.const, 1)
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Uncapitalize 3', () => {
  const T: Type.TDeferred<'Uncapitalize', [Type.TRef<'A'>]> = Type.Uncapitalize(Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Uncapitalize')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Uncapitalize 4', () => {
  const T: Type.TLiteral<'hELLO'> = Type.Uncapitalize(Type.Literal('HELLO'))
})
Test('Should Uncapitalize 5', () => {
  const T: Type.TLiteral<'hELLO'> = Type.Uncapitalize(Type.Literal('HELLO'))
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 'hELLO')
})
Test('Should Uncapitalize 6', () => {
  const T: Type.TUnion<[
    Type.TLiteral<'hELLO'>,
    Type.TLiteral<'wORLD'>
  ]> = Type.Uncapitalize(Type.Union([
    Type.Literal('HELLO'),
    Type.Literal('WORLD')
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'hELLO')
  Assert.IsEqual(T.anyOf[1].const, 'wORLD')
})
Test('Should Uncapitalize 7', () => {
  const T: Type.TUnion<[Type.TLiteral<'hELLO0'>, Type.TLiteral<'hELLO1'>]> = Type.Uncapitalize(Type.TemplateLiteral('HELLO${0|1}'))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'hELLO0')
  Assert.IsEqual(T.anyOf[1].const, 'hELLO1')
})
