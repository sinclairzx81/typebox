import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TFunction', () => {
  it('Should guard for TFunction', () => {
    const R = TypeGuard.TFunction(Type.Function([], Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TFunction', () => {
    const R = TypeGuard.TFunction(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TFunction with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TFunction(Type.Function([], Type.Number(), { $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TFunction with invalid Params', () => {
    const R = TypeGuard.TFunction(Type.Function([{} as any, {} as any], Type.Number()))
    Assert.IsFalse(R)
  })
  it('Should not guard for TFunction with invalid Return', () => {
    const R = TypeGuard.TFunction(Type.Function([], {} as any))
    Assert.IsFalse(R)
  })
  it('Should guard for TFunction with empty Rest Tuple', () => {
    const R = TypeGuard.TFunction(Type.Function(Type.Rest(Type.Tuple([])), Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should guard for TFunction with Rest Tuple', () => {
    const R = TypeGuard.TFunction(Type.Function(Type.Rest(Type.Tuple([Type.Number(), Type.String()])), Type.Number()))
    Assert.IsTrue(R)
  })
})
