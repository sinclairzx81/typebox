import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/normal/Union', () => {
  it('Normalize 1', () => {
    const T = Type.Union([Type.Number(), Type.String()])
    const R = TypeGuard.TUnion(T)
    Assert.IsTrue(R)
  })
  it('Normalize 2', () => {
    const T = Type.Union([Type.Number()])
    const R = TypeGuard.TNumber(T)
    Assert.IsTrue(R)
  })
  it('Normalize 3', () => {
    const T = Type.Union([])
    const R = TypeGuard.TNever(T)
    Assert.IsTrue(R)
  })
})
