import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TNot', () => {
  it('Should guard for TNot', () => {
    const R = TypeGuard.TNot(Type.Not(Type.String(), Type.String()))
    Assert.isEqual(R, true)
  })
  it('Should not guard for TNot 1', () => {
    const R = TypeGuard.TNot(Type.Not(null as any, Type.String()))
    Assert.isEqual(R, false)
  })
  it('Should not guard for TNot 2', () => {
    const R = TypeGuard.TNot(Type.Not(Type.String(), null as any))
    Assert.isEqual(R, false)
  })
  it('Should not guard for TNot with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TNot(Type.Not(Type.String(), Type.String()), { $id: 1 })
    Assert.isEqual(R, true)
  })
})
