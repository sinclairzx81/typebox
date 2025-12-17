import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Literal')

Test('Should Literal 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsLiteral(T))
})
Test('Should Literal 2', () => {
  const T: Type.TLiteral<1> = Type.Script('1')
  Assert.IsTrue(Type.IsLiteral(T))
})
Test('Should Literal 3', () => {
  const T: Type.TLiteral<1> = Type.Script('Assign<1, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
// ------------------------------------------------------------------
// Literal Guards
// ------------------------------------------------------------------
Test('Should Literal 4', () => {
  const T: Type.TLiteral<10n> = Type.Script('10n')
  Assert.IsTrue(Type.IsLiteralBigInt(T))
})
Test('Should Literal 5', () => {
  const T: Type.TLiteral<true> = Type.Script('true')
  Assert.IsTrue(Type.IsLiteralBoolean(T))
})
Test('Should Literal 6', () => {
  const T: Type.TLiteral<123> = Type.Script('123')
  Assert.IsTrue(Type.IsLiteralNumber(T))
})
Test('Should Literal 7', () => {
  const T: Type.TLiteral<'hello'> = Type.Script(`'hello'`)
  Assert.IsTrue(Type.IsLiteralString(T))
})
Test('Should Literal 8', () => {
  const T: Type.TLiteral<true> = Type.Literal(true)
  Assert.IsFalse(Type.IsLiteralBigInt(T))
})
Test('Should Literal 9', () => {
  const T: Type.TLiteral<true> = Type.Literal(true)
  Assert.IsFalse(Type.IsLiteralNumber(T))
})
Test('Should Literal 10', () => {
  const T: Type.TLiteral<123> = Type.Script('123')
  Assert.IsFalse(Type.IsLiteralString(T))
})
Test('Should Literal 11', () => {
  const T: Type.TLiteral<'hello'> = Type.Script('"hello"')
  Assert.IsFalse(Type.IsLiteralBoolean(T))
})
// ------------------------------------------------------------------
// Literal Numerics
// ------------------------------------------------------------------
Test('Should Literal 12', () => {
  const T: Type.TLiteral<number> = Type.Script('0.')
  Assert.IsTrue(Type.IsLiteralNumber(T))
})
Test('Should Literal 13', () => {
  const T: Type.TLiteral<number> = Type.Script('.0')
  Assert.IsTrue(Type.IsLiteralNumber(T))
})
Test('Should Literal 14', () => {
  const T: Type.TLiteral<3.14> = Type.Script('3.14')
  Assert.IsTrue(Type.IsLiteralNumber(T))
})
Test('Should Literal 15', () => {
  const T: Type.TLiteral<number> = Type.Script('0.0')
  Assert.IsTrue(Type.IsLiteralNumber(T))
})
Test('Should Literal 16', () => {
  const T: Type.TLiteral<0> = Type.Script('00.0')
  Assert.IsEqual(T.const, 0)
})
Test('Should Literal 17', () => {
  const T: Type.TLiteral<0> = Type.Script('00')
  Assert.IsEqual(T.const, 0)
})
