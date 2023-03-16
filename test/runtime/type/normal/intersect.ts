import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/normal/Intersect', () => {
  it('Normalize 1', () => {
    const T = Type.Intersect([Type.Number(), Type.String()])
    const R = TypeGuard.TIntersect(T)
    Assert.deepEqual(R, true)
  })
  it('Normalize 2', () => {
    const T = Type.Intersect([Type.Number()])
    const R = TypeGuard.TNumber(T)
    Assert.deepEqual(R, true)
  })
  it('Normalize 3', () => {
    const T = Type.Intersect([])
    const R = TypeGuard.TNever(T)
    Assert.deepEqual(R, true)
  })
})
