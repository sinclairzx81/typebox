import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TNot', () => {
  it('Should guard for TNot', () => {
    const R = TypeGuard.TNot(Type.Not(Type.String()))
    Assert.IsEqual(R, true)
  })
  it('Should not guard for TNot 1', () => {
    const R = TypeGuard.TNot(Type.Not(null as any))
    Assert.IsEqual(R, false)
  })
  it('Should not guard for TNot with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TNot(Type.Not(Type.String()), { $id: 1 })
    Assert.IsEqual(R, true)
  })
})
