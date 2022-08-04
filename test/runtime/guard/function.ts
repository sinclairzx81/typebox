import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TFunction', () => {
  it('should guard for TFunction', () => {
    const R = TypeGuard.TFunction(Type.Function([], Type.Number()))
    Assert.equal(R, true)
  })
  it('should not guard for TFunction', () => {
    const R = TypeGuard.TFunction(null)
    Assert.equal(R, false)
  })
  it('should not guard for TFunction with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TFunction(Type.Function([], Type.Number(), { $id: 1 }))
    Assert.equal(R, false)
  })
  it('should not guard for TFunction with invalid Params', () => {
    const R = TypeGuard.TFunction(Type.Function([{} as any, {} as any], Type.Number()))
    Assert.equal(R, false)
  })
  it('should not guard for TFunction with invalid Return', () => {
    const R = TypeGuard.TFunction(Type.Function([], {} as any))
    Assert.equal(R, false)
  })
  it('should guard for TFunction with empty TTuple', () => {
    const R = TypeGuard.TFunction(Type.Function(Type.Tuple([]), Type.Number()))
    Assert.equal(R, true)
  })
  it('should guard for TFunction with array TTuple', () => {
    const R = TypeGuard.TFunction(Type.Function(Type.Tuple([Type.Number(), Type.String()]), Type.Number()))
    Assert.equal(R, true)
  })
})
