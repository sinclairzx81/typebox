import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TVoid', () => {
  it('Should guard for TVoid', () => {
    const R = TypeGuard.TVoid(Type.Void())
    Assert.IsEqual(R, true)
  })
  it('Should not guard for TVoid', () => {
    const R = TypeGuard.TVoid(null)
    Assert.IsEqual(R, false)
  })
  it('Should not guard for TVoid with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TVoid(Type.Void({ $id: 1 }))
    Assert.IsEqual(R, false)
  })
})
