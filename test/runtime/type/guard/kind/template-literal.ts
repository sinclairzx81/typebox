import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TTemplateLiteral', () => {
  it('Should guard for empty TemplateLiteral', () => {
    const R = KindGuard.IsTemplateLiteral(Type.TemplateLiteral([]))
    Assert.IsTrue(R)
  })
  it('Should guard for TSchema', () => {
    const R = KindGuard.IsSchema(Type.TemplateLiteral([]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TTemplateLiteral)', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    const R = KindGuard.IsTemplateLiteral(Type.TemplateLiteral([T, Type.Literal('world')]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TLiteral)', () => {
    const R = KindGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.Literal('hello')]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TString)', () => {
    const R = KindGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.String()]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TNumber)', () => {
    const R = KindGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.Number()]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TBoolean)', () => {
    const R = KindGuard.IsTemplateLiteral(Type.TemplateLiteral([Type.Boolean()]))
    Assert.IsTrue(R)
  })
})
