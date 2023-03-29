import { Kind, TypeGuard, TypeRegistry } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TUnsafe', () => {
  it('Should guard raw TUnsafe', () => {
    const T = Type.Unsafe({ x: 1 })
    const R = TypeGuard.TUnsafe(T)
    Assert.equal(R, true)
  })
  it('Should guard raw TUnsafe as TSchema', () => {
    const T = Type.Unsafe({ x: 1 })
    const R = TypeGuard.TSchema(T)
    Assert.equal(R, true)
  })
  it('Should guard override TUnsafe as TSchema when registered', () => {
    TypeRegistry.Set('type/guard/TUnsafe/Type1', () => true)
    const T = Type.Unsafe({ [Kind]: 'type/guard/TUnsafe/Type1' })
    const R = TypeGuard.TSchema(T)
    Assert.equal(R, true)
  })
  it('Should not guard TUnsafe with unregistered kind', () => {
    const T = Type.Unsafe({ [Kind]: 'type/guard/TUnsafe/Type2' })
    const R = TypeGuard.TUnsafe(T)
    Assert.equal(R, false)
  })
  it('Should not guard for TString', () => {
    const T = Type.String()
    const R = TypeGuard.TUnsafe(T)
    Assert.equal(R, false)
  })
})
