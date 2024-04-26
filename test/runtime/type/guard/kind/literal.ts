import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TLiteral', () => {
  it('Should guard for TLiteral of String', () => {
    const R = KindGuard.IsLiteral(Type.Literal('hello'))
    Assert.IsTrue(R)
  })
  it('Should guard for TLiteral of Number', () => {
    const R = KindGuard.IsLiteral(Type.Literal(42))
    Assert.IsTrue(R)
  })
  it('Should guard for TLiteral of Boolean', () => {
    const R = KindGuard.IsLiteral(Type.Literal(true))
    Assert.IsTrue(R)
  })
})
