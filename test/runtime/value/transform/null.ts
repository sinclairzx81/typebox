import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Null', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Null())
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, null)
    Assert.IsEqual(R, null)
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, null)
    Assert.IsEqual(R, null)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, undefined))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Null())
    .Decode((value) => 1)
    .Encode((value) => null)
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, null)
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, 123)
    Assert.IsEqual(R, null)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, undefined))
  })
})
