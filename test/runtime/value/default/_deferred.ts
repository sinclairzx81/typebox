import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Deferred', () => {
  it('Should use deferred value', () => {
    const T = Type.Any({ default: () => 1 })
    const R = Value.Default(T, 1)
    Assert.IsEqual(R, 1)
  })
})
