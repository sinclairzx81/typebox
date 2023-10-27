import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/clean/Promise', () => {
  it('Should clean 1', () => {
    const T = Type.Promise(Type.Any())
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
})
