import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TConstructor', () => {
  it('should guard for TConstructor', () => {
    const R = TypeGuard.TConstructor(Type.Constructor([], Type.Number()))
    Assert.equal(R, true)
  })
  it('should not guard for TConstructor', () => {
    const R = TypeGuard.TConstructor(null)
    Assert.equal(R, false)
  })
  it('should not guard for TConstructor with invalid Params', () => {
    const R = TypeGuard.TConstructor(Type.Constructor([{} as any, {} as any], Type.Number()))
    Assert.equal(R, false)
  })
  it('should not guard for TConstructor with invalid Return', () => {
    const R = TypeGuard.TConstructor(Type.Constructor([], {} as any))
    Assert.equal(R, false)
  })
})
