import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TRest', () => {
  it('Should guard Rest 1', () => {
    const T = Type.Tuple([Type.String(), Type.Number()])
    const R = Type.Rest(T)
    Assert.isTrue(TypeGuard.TString(R[0]))
    Assert.isTrue(TypeGuard.TNumber(R[1]))
  })
  it('Should guard Rest 2', () => {
    const T = Type.Tuple([])
    const R = Type.Rest(T)
    Assert.isEqual(R.length, 0)
  })
  it('Should guard Rest 3', () => {
    const T = Type.String()
    const R = Type.Rest(T)
    Assert.isTrue(TypeGuard.TString(R[0]))
  })
})
