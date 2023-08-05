import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Iterator', () => {
  const T = Type.Iterator(Type.Any())
  it('Should passthrough 1', () => {
    const V = (function* () {})()
    const R = Value.Convert(T, V)
    Assert.IsEqual(R, V)
  })
  it('Should passthrough 2', () => {
    const V = 1
    const R = Value.Convert(T, V)
    Assert.IsEqual(R, V)
  })
})
