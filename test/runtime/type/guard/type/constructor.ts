import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TConstructor', () => {
  it('Should guard for TConstructor', () => {
    const R = TypeGuard.IsConstructor(Type.Constructor([], Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TConstructor', () => {
    const R = TypeGuard.IsConstructor(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TConstructor with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsConstructor(Type.Constructor([], Type.Number(), { $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TConstructor with invalid Params', () => {
    const R = TypeGuard.IsConstructor(Type.Constructor([{} as any, {} as any], Type.Number()))
    Assert.IsFalse(R)
  })
  it('Should not guard for TConstructor with invalid Return', () => {
    const R = TypeGuard.IsConstructor(Type.Constructor([], {} as any))
    Assert.IsFalse(R)
  })
  it('Should guard for TConstructor with empty Rest Tuple', () => {
    const R = TypeGuard.IsConstructor(Type.Constructor(Type.Rest(Type.Tuple([])), Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should guard for TConstructor with Rest Tuple', () => {
    const R = TypeGuard.IsConstructor(Type.Constructor(Type.Rest(Type.Tuple([Type.Number(), Type.String()])), Type.Number()))
    Assert.IsTrue(R)
  })
})
