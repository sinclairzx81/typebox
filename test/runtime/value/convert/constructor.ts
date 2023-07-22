import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// --------------------------------------------------------
// non-convertable pass through
// --------------------------------------------------------
describe('value/convert/Constructor', () => {
  const T = Type.Constructor([], Type.Any())
  it('Should passthrough 1', () => {
    const V = function () {}
    const R = Value.Convert(T, V)
    Assert.isEqual(R, V)
  })
  it('Should passthrough 2', () => {
    const V = 1
    const R = Value.Convert(T, V)
    Assert.isEqual(R, V)
  })
})
