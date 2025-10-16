// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Literal')

// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
Test('Should throw on invalid Literal value', () => {
  Assert.Throws(() => Type.Literal(null as never))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should not guard Literal', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsLiteral(T))
})
Test('Should Create Literal 1', () => {
  const T: Type.TLiteral<1> = Type.Literal(1)
  Assert.IsTrue(Type.IsLiteral(T))
})
Test('Should Create Literal with options', () => {
  const T: Type.TLiteral<1> = Type.Literal(1, { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
// ------------------------------------------------------------------
// Literal Guards
// ------------------------------------------------------------------
Test('Should guard LiteralBigint', () => {
  const T: Type.TLiteral<100n> = Type.Literal(100n)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsTrue(Type.IsLiteralBigInt(T))
  Assert.IsEqual(T.type, 'bigint')
})
Test('Should guard LiteralBoolean', () => {
  const T: Type.TLiteral<true> = Type.Literal(true)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsTrue(Type.IsLiteralBoolean(T))
  Assert.IsEqual(T.type, 'boolean')
})
Test('Should guard LiteralNumber', () => {
  const T: Type.TLiteral<123> = Type.Literal(123)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsTrue(Type.IsLiteralNumber(T))
  Assert.IsEqual(T.type, 'number')
})
Test('Should guard LiteralString', () => {
  const T: Type.TLiteral<'hello'> = Type.Literal('hello')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsTrue(Type.IsLiteralString(T))
  Assert.IsEqual(T.type, 'string')
})
// ------------------------------------------------------------------
// Invariant Literal Guards
// ------------------------------------------------------------------
Test('Should not guard LiteralBigInt', () => {
  const T: Type.TLiteral<true> = Type.Literal(true)
  Assert.IsFalse(Type.IsLiteralBigInt(T))
})
Test('Should not guard LiteralBoolean', () => {
  const T: Type.TLiteral<true> = Type.Literal(true)
  Assert.IsFalse(Type.IsLiteralNumber(T))
})
Test('Should not guard LiteralNumber', () => {
  const T: Type.TLiteral<123> = Type.Literal(123)
  Assert.IsFalse(Type.IsLiteralString(T))
})
Test('Should not guard LiteralString', () => {
  const T: Type.TLiteral<'hello'> = Type.Literal('hello')
  Assert.IsFalse(Type.IsLiteralBoolean(T))
})