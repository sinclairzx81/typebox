import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Enum', () => {
  enum E {
    A,
    B,
    C,
  }
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Enum(E))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, E.A)
    Assert.IsEqual(R, E.A)
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, E.A)
    Assert.IsEqual(R, E.A)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Enum(E))
    .Decode((value) => 1)
    .Encode((value) => E.A)
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, E.A)
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, null)
    Assert.IsEqual(R, E.A)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
})
