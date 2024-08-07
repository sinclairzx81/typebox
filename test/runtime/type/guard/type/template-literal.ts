import { TypeGuard } from '@sinclair/typebox'
import { Type, CloneType, TemplateLiteralGenerate } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TTemplateLiteral', () => {
  it('Should guard for empty TemplateLiteral', () => {
    const R = TypeGuard.IsTemplateLiteral(Type.TemplateLiteral([]))
    Assert.IsTrue(R)
  })
  it('Should guard for TSchema', () => {
    const R = TypeGuard.IsSchema(Type.TemplateLiteral([]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TTemplateLiteral)', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    const R = TypeGuard.IsTemplateLiteral(Type.TemplateLiteral([T, Type.Literal('world')]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TLiteral)', () => {
    const R = TypeGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.Literal('hello')]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TString)', () => {
    const R = TypeGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.String()]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TNumber)', () => {
    const R = TypeGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.Number()]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TBoolean)', () => {
    const R = TypeGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.Boolean()]))
    Assert.IsTrue(R)
  })
  it('Should not guard for missing ^ expression prefix', () => {
    const T = CloneType(Type.TemplateLiteral([Type.Literal('hello')]))
    // @ts-ignore
    T.pattern = T.pattern.slice(1)
    Assert.IsFalse(TypeGuard.IsTemplateLiteral(T))
  })
  it('Should not guard for missing $ expression postfix', () => {
    const T = CloneType(Type.TemplateLiteral([Type.Literal('hello')]))
    // @ts-ignore
    T.pattern = T.pattern.slice(0, T.pattern.length - 1)
    Assert.IsFalse(TypeGuard.IsTemplateLiteral(T))
  })
  // ----------------------------------------------------------------
  // issue: https://github.com/sinclairzx81/typebox/issues/913
  // ----------------------------------------------------------------
  it('Should generate embedded template literal 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('X'), Type.Literal('Y')])])
    const L = Type.TemplateLiteral([Type.Literal('KEY'), A, B])
    const T = TemplateLiteralGenerate(L)
    Assert.IsEqual(T, ['KEYAX', 'KEYAY', 'KEYBX', 'KEYBY'])
  })
  it('Should generate embedded template literal 2', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('X'), Type.Literal('Y')])])
    const L = Type.TemplateLiteral([A, Type.Literal('KEY'), B])
    const T = TemplateLiteralGenerate(L)
    Assert.IsEqual(T, ['AKEYX', 'AKEYY', 'BKEYX', 'BKEYY'])
  })
  it('Should generate embedded template literal 3', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('X'), Type.Literal('Y')])])
    const L = Type.TemplateLiteral([A, B, Type.Literal('KEY')])
    const T = TemplateLiteralGenerate(L)
    Assert.IsEqual(T, ['AXKEY', 'AYKEY', 'BXKEY', 'BYKEY'])
  })
  it('Should map embedded template literal', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('X'), Type.Literal('Y')])])
    const L = Type.TemplateLiteral([Type.Literal('KEY'), A, B])
    const T = Type.Mapped(L, (K) => Type.Null())
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNull(T.properties.KEYAX))
    Assert.IsTrue(TypeGuard.IsNull(T.properties.KEYAY))
    Assert.IsTrue(TypeGuard.IsNull(T.properties.KEYBX))
    Assert.IsTrue(TypeGuard.IsNull(T.properties.KEYBY))
  })
})
