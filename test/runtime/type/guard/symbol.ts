import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TSymbol', () => {
  it('Should guard for TSymbol', () => {
    const R = TypeGuard.TSymbol(Type.Symbol())
    Assert.IsTrue(R)
  })
  it('Should not guard for TSymbol', () => {
    const R = TypeGuard.TSymbol(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TSymbol with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TSymbol(Type.Symbol({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
