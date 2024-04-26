import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TNot', () => {
  it('Should guard for TNot', () => {
    const R = TypeGuard.IsNot(Type.Not(Type.String()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TNot 1', () => {
    const R = TypeGuard.IsNot(Type.Not(null as any))
    Assert.IsFalse(R)
  })
  it('Should not guard for TNot with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsNot(Type.Not(Type.String()), { $id: 1 })
    Assert.IsTrue(R)
  })
})
