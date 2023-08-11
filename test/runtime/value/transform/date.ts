import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Date', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Date())
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, new Date(123))
    Assert.IsEqual(R, new Date(123))
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, new Date(123))
    Assert.IsEqual(R, new Date(123))
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Date())
    .Decode((value) => 1)
    .Encode((value) => new Date())
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, new Date())
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, null)
    Assert.IsInstanceOf(R, Date)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
})
