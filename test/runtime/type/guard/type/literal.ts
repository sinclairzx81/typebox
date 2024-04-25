import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TLiteral', () => {
  it('Should guard for TLiteral of String', () => {
    const R = TypeGuard.IsLiteral(Type.Literal('hello'))
    Assert.IsTrue(R)
  })
  it('Should guard for TLiteral of Number', () => {
    const R = TypeGuard.IsLiteral(Type.Literal(42))
    Assert.IsTrue(R)
  })
  it('Should guard for TLiteral of Boolean', () => {
    const R = TypeGuard.IsLiteral(Type.Literal(true))
    Assert.IsTrue(R)
  })
  it('Should not guard for TLiteral of Null', () => {
    // @ts-ignore
    const R = TypeGuard.IsLiteral(Type.Literal(null))
    Assert.IsFalse(R)
  })
  it('Should not guard for TLiteral', () => {
    const R = TypeGuard.IsLiteral(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TLiteral with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsLiteral(Type.Literal(42, { $id: 1 }))
    Assert.IsFalse(R)
  })
})
