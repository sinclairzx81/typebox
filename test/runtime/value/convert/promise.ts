import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// --------------------------------------------------------
// non-convertable pass through
// --------------------------------------------------------
describe('value/convert/Promise', () => {
  const T = Type.Promise(Type.Any())
  it('Should pass-through 1', () => {
    const V = Promise.resolve(1)
    const R = Value.Convert(T, V)
    console.log(R)
    Assert.IsEqual(R, V)
  })
  it('Should passthrough 2', () => {
    const V = 1
    const R = Value.Convert(T, V)
    Assert.IsEqual(R, V)
  })
})
