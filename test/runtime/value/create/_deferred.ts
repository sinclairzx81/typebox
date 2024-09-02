import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Deferred', () => {
  it('Should use deferred value', () => {
    const T = Type.Any({ default: () => 1 })
    const R = Value.Create(T)
    Assert.IsEqual(R, 1)
  })
})
