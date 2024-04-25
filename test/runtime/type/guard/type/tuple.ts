import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TTuple', () => {
  it('Should guard for TTuple', () => {
    const R = TypeGuard.IsTuple(Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsTrue(R)
  })
  it('Should not guard for TTuple', () => {
    const R = TypeGuard.IsTuple(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TTuple with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsTuple(Type.Tuple([Type.Number(), Type.Number()], { $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TTuple with invalid Items', () => {
    const R = TypeGuard.IsTuple(Type.Tuple([Type.Number(), {} as any]))
    Assert.IsFalse(R)
  })
})
