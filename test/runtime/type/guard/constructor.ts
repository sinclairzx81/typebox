import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TConstructor', () => {
  it('Should guard for TConstructor', () => {
    const R = TypeGuard.TConstructor(Type.Constructor([], Type.Number()))
    Assert.isEqual(R, true)
  })
  it('Should not guard for TConstructor', () => {
    const R = TypeGuard.TConstructor(null)
    Assert.isEqual(R, false)
  })
  it('Should not guard for TConstructor with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TConstructor(Type.Constructor([], Type.Number(), { $id: 1 }))
    Assert.isEqual(R, false)
  })
  it('Should not guard for TConstructor with invalid Params', () => {
    const R = TypeGuard.TConstructor(Type.Constructor([{} as any, {} as any], Type.Number()))
    Assert.isEqual(R, false)
  })
  it('Should not guard for TConstructor with invalid Return', () => {
    const R = TypeGuard.TConstructor(Type.Constructor([], {} as any))
    Assert.isEqual(R, false)
  })
  it('Should guard for TConstructor with empty Rest Tuple', () => {
    const R = TypeGuard.TConstructor(Type.Constructor(Type.Rest(Type.Tuple([])), Type.Number()))
    Assert.isEqual(R, true)
  })
  it('Should guard for TConstructor with Rest Tuple', () => {
    const R = TypeGuard.TConstructor(Type.Constructor(Type.Rest(Type.Tuple([Type.Number(), Type.String()])), Type.Number()))
    Assert.isEqual(R, true)
  })
})
