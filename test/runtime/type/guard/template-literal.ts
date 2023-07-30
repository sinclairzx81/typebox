import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TTemplateLiteral', () => {
  it('Should guard for empty TemplateLiteral', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([]))
    Assert.IsTrue(R)
  })
  it('Should guard for TSchema', () => {
    const R = TypeGuard.TSchema(Type.TemplateLiteral([]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TTemplateLiteral)', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([T, Type.Literal('world')]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TLiteral)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.Literal('hello')]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TString)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.String()]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TNumber)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.Number()]))
    Assert.IsTrue(R)
  })
  it('Should guard for TemplateLiteral (TBoolean)', () => {
    const R = TypeGuard.TTemplateLiteral(Type.TemplateLiteral([Type.Boolean()]))
    Assert.IsTrue(R)
  })
  it('Should not guard for missing ^ expression prefix', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    // @ts-ignore
    T.pattern = T.pattern.slice(1)
    Assert.IsFalse(TypeGuard.TTemplateLiteral(T))
  })
  it('Should not guard for missing $ expression postfix', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello')])
    // @ts-ignore
    T.pattern = T.pattern.slice(0, T.pattern.length - 1)
    Assert.IsFalse(TypeGuard.TTemplateLiteral(T))
  })
})
