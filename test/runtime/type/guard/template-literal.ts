import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TTemplateLiteral', () => {
  it('Should guard for empty TemplateLiteral', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([]))
    Assert.equal(R, true)
  })
  it('Should guard for TSchema', () => {
    const R = TypeGuard.TSchema(Type.TemplateLiteral([]))
    Assert.equal(R, true)
  })
  it('Should guard for TemplateLiteral (TTemplateLiteral)', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([T, Type.Literal('world')]))
    Assert.equal(R, true)
  })
  it('Should guard for TemplateLiteral (TLiteral)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.Literal('hello')]))
    Assert.equal(R, true)
  })
  it('Should guard for TemplateLiteral (TString)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.String()]))
    Assert.equal(R, true)
  })
  it('Should guard for TemplateLiteral (TNumber)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.Number()]))
    Assert.equal(R, true)
  })
  it('Should guard for TemplateLiteral (TBoolean)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.Boolean()]))
    Assert.equal(R, true)
  })
  it('Should not guard for missing ^ expression prefix', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    // @ts-ignore
    T.pattern = T.pattern.slice(1)
    Assert.equal(TypeGuard.TTemplateLiteral(T), false)
  })
  it('Should not guard for missing $ expression postfix', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    // @ts-ignore
    T.pattern = T.pattern.slice(0, T.pattern.length - 1)
    Assert.equal(TypeGuard.TTemplateLiteral(T), false)
  })
})
