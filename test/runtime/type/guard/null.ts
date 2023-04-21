import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TNull', () => {
  it('Should guard for TNull', () => {
    const R = TypeGuard.TNull(Type.Null())
    Assert.isEqual(R, true)
  })
  it('Should not guard for TNull', () => {
    const R = TypeGuard.TNull(null)
    Assert.isEqual(R, false)
  })
  it('Should not guard for TNull with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TNull(Type.Null({ $id: 1 }))
    Assert.isEqual(R, false)
  })
})
