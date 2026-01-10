import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Engine.TemplateLiteral')

// ------------------------------------------------------------------
// Coverage: Finite
// ------------------------------------------------------------------
Test('Should TemplateLiteral 1', () => {
  const A = Type.TemplateLiteral([])
  const R: Type.TRecord<'^$', Type.TString> = Type.Record(A, Type.String())
  Assert.IsTrue(Type.IsRecord(R))
  Assert.IsEqual(Type.RecordPattern(R), '^$')
  Assert.IsTrue(Type.IsString(Type.RecordValue(R)))
})
// ------------------------------------------------------------------
// Coverage: Decode | Decode Paths are trigged when transforming
//                    to Union. We use a Record for this.
// ------------------------------------------------------------------
Test('Should TemplateLiteral 2', () => {
  const A = Type.TemplateLiteral([])
  const R: Type.TRecord<'^$', Type.TString> = Type.Record(A, Type.String())
  Assert.IsTrue(Type.IsRecord(R))
  Assert.IsEqual(Type.RecordPattern(R), '^$')
  Assert.IsTrue(Type.IsString(Type.RecordValue(R)))
})
// ------------------------------------------------------------------
// Coverage: TemplateLiteralDecode
// ------------------------------------------------------------------
Test('Should TemplateLiteralDecode 1', () => {
  const A: Type.TString = Type.TemplateLiteralDecode('')
  Assert.IsTrue(Type.IsString(A))
  Assert.IsFalse(Guard.HasPropertyKey(A, 'pattern')) // non-representable patterns are discarded
})
Test('Should TemplateLiteralDecode 2', () => {
  const A: Type.TString = Type.TemplateLiteralDecode('x-.*$')
  Assert.IsTrue(Type.IsString(A))
})
Test('Should TemplateLiteralDecode 3', () => {
  const A: Type.TString = Type.TemplateLiteralDecode('^x-.*')
  Assert.IsTrue(Type.IsString(A))
})
Test('Should TemplateLiteralDecode 4', () => {
  const A: Type.TString = Type.TemplateLiteralDecode('^x-.*$')
  Assert.IsTrue(Type.IsString(A))
})
Test('Should TemplateLiteralDecode 5', () => {
  const A: Type.TUnion<[
    Type.TLiteral<'x-1'>,
    Type.TLiteral<'x-2'>
  ]> = Type.TemplateLiteralDecode('^x-(1|2)$')
  Assert.IsTrue(Type.IsUnion(A))
  Assert.IsTrue(Guard.IsEqual(A.anyOf[0].const, 'x-1'))
  Assert.IsTrue(Guard.IsEqual(A.anyOf[1].const, 'x-2'))
})
// ------------------------------------------------------------------
// Coverage: TemplateLiteralDecodeUnsafe
// ------------------------------------------------------------------
Test('Should TemplateLiteralDecodeUnsafe 1', () => {
  const A: Type.TString = Type.TemplateLiteralDecodeUnsafe('')
  Assert.IsTrue(Type.IsString(A))
  Assert.IsFalse(Guard.HasPropertyKey(A, 'pattern')) // non-representable patterns are discarded
})
Test('Should TemplateLiteralDecodeUnsafe 2', () => {
  const A: Type.TString = Type.TemplateLiteralDecodeUnsafe('x-.*$')
  Assert.IsTrue(Type.IsString(A))
})
Test('Should TemplateLiteralDecodeUnsafe 3', () => {
  const A: Type.TString = Type.TemplateLiteralDecodeUnsafe('^x-.*')
  Assert.IsTrue(Type.IsString(A))
})
Test('Should TemplateLiteralDecodeUnsafe 4', () => {
  const A: Type.TTemplateLiteral<'^x-.*$'> = Type.TemplateLiteralDecodeUnsafe('^x-.*$')
  Assert.IsTrue(Type.IsTemplateLiteral(A))
  Assert.IsTrue(Guard.IsEqual(A.pattern, '^x-.*$'))
})
Test('Should TemplateLiteralDecodeUnsafe 5', () => {
  const A: Type.TUnion<[
    Type.TLiteral<'x-1'>,
    Type.TLiteral<'x-2'>
  ]> = Type.TemplateLiteralDecodeUnsafe('^x-(1|2)$')
  Assert.IsTrue(Type.IsUnion(A))
  Assert.IsTrue(Guard.IsEqual(A.anyOf[0].const, 'x-1'))
  Assert.IsTrue(Guard.IsEqual(A.anyOf[1].const, 'x-2'))
})
