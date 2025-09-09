// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Capitalize')

// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
Test('Should Capitalize 1', () => {
  const T: Type.TString = Type.Uppercase(Type.String())
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Capitalize 2', () => {
  const T: Type.TLiteral<1> = Type.Uppercase(Type.Literal(1))
  Assert.IsEqual(T.const, 1)
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Capitalize 3', () => {
  const T: Type.TDeferred<"Capitalize", [Type.TRef<"A">]> = Type.Capitalize(Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Capitalize')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Capitalize 4', () => {
  const T: Type.TLiteral<"Hello"> = Type.Capitalize(Type.Literal('hello'))
})
Test('Should Capitalize 5', () => {
  const T: Type.TLiteral<"Hello"> = Type.Capitalize(Type.Literal('hello'))
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 'Hello')
})
Test('Should Capitalize 6', () => {
  const T: Type.TUnion<[
    Type.TLiteral<"Hello">, 
    Type.TLiteral<"World">
  ]> = Type.Capitalize(Type.Union([
    Type.Literal('hello'),
    Type.Literal('world')
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'Hello')
  Assert.IsEqual(T.anyOf[1].const, 'World')
})
Test('Should Capitalize 7', () => {
  const T: Type.TUnion<[Type.TLiteral<"Hello0">, Type.TLiteral<"Hello1">]> = Type.Capitalize(Type.TemplateLiteral('hello${0|1}'))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'Hello0')
  Assert.IsEqual(T.anyOf[1].const, 'Hello1')
})