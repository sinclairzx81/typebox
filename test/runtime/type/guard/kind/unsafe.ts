import { Kind, KindGuard, TypeRegistry } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TUnsafe', () => {
  it('Should guard raw TUnsafe', () => {
    const T = Type.Unsafe({ x: 1 })
    const R = KindGuard.IsUnsafe(T)
    Assert.IsTrue(R)
  })
  it('Should guard raw TUnsafe as TSchema', () => {
    const T = Type.Unsafe({ x: 1 })
    const R = KindGuard.IsSchema(T)
    Assert.IsTrue(R)
  })
  it('Should guard override TUnsafe as TSchema when registered', () => {
    TypeRegistry.Set('UnsafeType', () => true)
    const T = Type.Unsafe({ [Kind]: 'UnsafeType' })
    const R = KindGuard.IsSchema(T)
    Assert.IsTrue(R)
    TypeRegistry.Delete('UnsafeType')
  })
  it('Should not guard TUnsafe with unregistered kind', () => {
    const T = Type.Unsafe({ [Kind]: 'UnsafeType' })
    const R = KindGuard.IsUnsafe(T)
    Assert.IsFalse(R)
  })
  it('Should not guard for TString', () => {
    const T = Type.String()
    const R = KindGuard.IsUnsafe(T)
    Assert.IsFalse(R)
  })
})
