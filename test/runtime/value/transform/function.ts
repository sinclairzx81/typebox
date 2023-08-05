import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Function', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Function([], Type.Any()))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, class {})
    Assert.IsTypeOf(R, 'function')
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, class {})
    Assert.IsTypeOf(R, 'function')
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Function([], Type.Any()))
    .Decode((value) => 1)
    .Encode((value) => function () {})
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, function () {})
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, null)
    Assert.IsTypeOf(R, 'function')
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
})
