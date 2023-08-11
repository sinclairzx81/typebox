import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Number', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Number())
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, 42)
    Assert.IsEqual(R, 42)
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, 42)
    Assert.IsEqual(R, 42)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Number())
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, 1)
    Assert.IsEqual(R, 2)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, 2)
    Assert.IsEqual(R, 1)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, undefined))
  })
})
