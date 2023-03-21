import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/normal/Extract', () => {
  it('Normalize 1', () => {
    const T = Type.Extract(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.Union([Type.String(), Type.Number()]))
    const R = TypeGuard.TUnion(T)
    Assert.deepEqual(R, true)
  })
  it('Normalize 2', () => {
    const T = Type.Extract(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.String())
    const R = TypeGuard.TString(T)
    Assert.deepEqual(R, true)
  })
  it('Normalize 3', () => {
    const T = Type.Extract(Type.Union([Type.String(), Type.Number()]), Type.String())
    const R = TypeGuard.TString(T)
    Assert.deepEqual(R, true)
  })
  it('Normalize 4', () => {
    const T = Type.Extract(Type.Union([Type.String()]), Type.String())
    const R = TypeGuard.TString(T)
    Assert.deepEqual(R, true)
  })
  it('Normalize 5', () => {
    const T = Type.Extract(Type.Union([]), Type.String())
    const R = TypeGuard.TNever(T)
    Assert.deepEqual(R, true)
  })
})
