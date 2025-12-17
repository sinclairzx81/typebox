import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.TemplateLiteral')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should TemplateLiteral 1', () => {
  const A: Type.TTemplateLiteralDeferred<[Type.TLiteral<''>, Type.TRef<'S'>, Type.TLiteral<''>]> = Type.Script('`${S}`')
  Assert.IsTrue(Type.IsDeferred(A))
  Assert.IsEqual(A.action, 'TemplateLiteral')
  Assert.IsTrue(Type.IsLiteral(A.parameters[0][0]))
  Assert.IsTrue(Type.IsRef(A.parameters[0][1]))
  Assert.IsTrue(Type.IsLiteral(A.parameters[0][2]))
})
// ------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------
Test('Should TemplateLiteral 2', () => {
  const T: Type.TTemplateLiteral<'^hello$'> = Type.Script('`hello`')
  Assert.IsFalse(Type.IsNull(T))
})
Test('Should TemplateLiteral 3', () => {
  const T: Type.TTemplateLiteral<'^hello$'> = Type.Script('`hello`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello$')
})
Test('Should TemplateLiteral 4', () => {
  const T: Type.TTemplateLiteral<'^hello$'> = Type.Script('Assign<`hello`, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
// ------------------------------------------------------------------
// Embedded Union
// ------------------------------------------------------------------
Test('Should TemplateLiteral 5', () => {
  const T: Type.TTemplateLiteral<'^hello (A|B)$'> = Type.Script('`hello ${"A" | "B"}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello (A|B)$')
})
Test('Should TemplateLiteral 6', () => {
  const T: Type.TTemplateLiteral<'^hello (A|B) world (C|D)$'> = Type.Script('`hello ${"A" | "B"} world ${"C" | "D"}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello (A|B) world (C|D)$')
})
Test('Should TemplateLiteral 7', () => {
  const T: Type.TTemplateLiteral<'^hello (A|B) rest$'> = Type.Script('`hello ${"A" | "B"} rest`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello (A|B) rest$')
})
// ------------------------------------------------------------------
// Embedded Infinite
// ------------------------------------------------------------------
Test('Should TemplateLiteral 8', () => {
  const T: Type.TTemplateLiteral<'^hello -?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$'> = Type.Script('`hello ${number}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello -?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$')
})
Test('Should TemplateLiteral 9', () => {
  const T: Type.TTemplateLiteral<'^hello .*$'> = Type.Script('`hello ${string}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello .*$')
})
Test('Should TemplateLiteral 10', () => {
  const T: Type.TTemplateLiteral<'^hello -?(?:0|[1-9][0-9]*)$'> = Type.Script('`hello ${integer}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello -?(?:0|[1-9][0-9]*)$')
})
Test('Should TemplateLiteral 11', () => {
  const T: Type.TTemplateLiteral<'^hello -?(?:0|[1-9][0-9]*)n$'> = Type.Script('`hello ${bigint}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello -?(?:0|[1-9][0-9]*)n$')
})
Test('Should TemplateLiteral 12', () => {
  const T: Type.TTemplateLiteral<'^hello (false|true)$'> = Type.Script('`hello ${boolean}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello (false|true)$')
})
// ------------------------------------------------------------------
// Parameterized
// ------------------------------------------------------------------
Test('Should TemplateLiteral 13', () => {
  const A = Type.Union([
    Type.Literal('A'),
    Type.Literal('B')
  ])
  const T: Type.TTemplateLiteral<'^hello (A|B)$'> = Type.Script({ A }, '`hello ${A}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello (A|B)$')
})
Test('Should TemplateLiteral 14', () => {
  const A = Type.Script('`${"A" | "B"}`')
  const T: Type.TTemplateLiteral<'^hello (A|B)$'> = Type.Script({ A }, '`hello ${A}`')
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^hello (A|B)$')
})
