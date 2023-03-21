import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TLiteral', () => {
  it('Should guard for TLiteral of String', () => {
    const R = TypeGuard.TLiteral(Type.Literal('hello'))
    Assert.equal(R, true)
  })
  it('Should guard for TLiteral of Number', () => {
    const R = TypeGuard.TLiteral(Type.Literal(42))
    Assert.equal(R, true)
  })
  it('Should guard for TLiteral of Boolean', () => {
    const R = TypeGuard.TLiteral(Type.Literal(true))
    Assert.equal(R, true)
  })
  it('Should not guard for TLiteral of Null', () => {
    // @ts-ignore
    const R = TypeGuard.TLiteral(Type.Literal(null))
    Assert.equal(R, false)
  })
  it('Should not guard for TLiteral', () => {
    const R = TypeGuard.TLiteral(null)
    Assert.equal(R, false)
  })
  it('Should not guard for TLiteral with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TLiteral(Type.Literal(42, { $id: 1 }))
    Assert.equal(R, false)
  })
})
