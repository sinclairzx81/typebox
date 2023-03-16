import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TTuple', () => {
  it('Should guard for TTuple', () => {
    const R = TypeGuard.TTuple(Type.Tuple([Type.Number(), Type.Number()]))
    Assert.equal(R, true)
  })
  it('Should not guard for TTuple', () => {
    const R = TypeGuard.TTuple(null)
    Assert.equal(R, false)
  })
  it('Should not guard for TTuple with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TTuple(Type.Tuple([Type.Number(), Type.Number()], { $id: 1 }))
    Assert.equal(R, false)
  })
  it('Should not guard for TTuple with invalid Items', () => {
    const R = TypeGuard.TTuple(Type.Tuple([Type.Number(), {} as any]))
    Assert.equal(R, false)
  })
})
