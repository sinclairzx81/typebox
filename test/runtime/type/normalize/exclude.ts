import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/normalize/Exclude', () => {
  it('Normalize 1', () => {
    const T = Type.Exclude(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.String())
    const R = TypeGuard.IsUnion(T)
    Assert.IsTrue(R)
  })
  it('Normalize 2', () => {
    const T = Type.Exclude(Type.Union([Type.String(), Type.Number()]), Type.String())
    const R = TypeGuard.IsNumber(T)
    Assert.IsTrue(R)
  })
  it('Normalize 3', () => {
    const T = Type.Exclude(Type.Union([Type.String()]), Type.String())
    const R = TypeGuard.IsNever(T)
    Assert.IsTrue(R)
  })
})
