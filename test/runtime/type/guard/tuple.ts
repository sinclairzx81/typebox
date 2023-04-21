import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TTuple', () => {
  it('Should guard for TTuple', () => {
    const R = TypeGuard.TTuple(Type.Tuple([Type.Number(), Type.Number()]))
    Assert.isEqual(R, true)
  })
  it('Should not guard for TTuple', () => {
    const R = TypeGuard.TTuple(null)
    Assert.isEqual(R, false)
  })
  it('Should not guard for TTuple with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TTuple(Type.Tuple([Type.Number(), Type.Number()], { $id: 1 }))
    Assert.isEqual(R, false)
  })
  it('Should not guard for TTuple with invalid Items', () => {
    const R = TypeGuard.TTuple(Type.Tuple([Type.Number(), {} as any]))
    Assert.isEqual(R, false)
  })
})
