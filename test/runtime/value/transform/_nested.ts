import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Nested', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T11 = Type.Transform(Type.Literal(1))
    .Decode((value) => value)
    .Encode((value) => value)
  const T12 = Type.Transform(T11)
    .Decode((value) => value)
    .Encode((value) => value)
  const T13 = Type.Transform(T12)
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T13, 1)
    Assert.IsEqual(R, 1)
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T13, 1)
    Assert.IsEqual(R, 1)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T13, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T21 = Type.Transform(Type.Literal(1))
    .Decode((value) => 2 as const)
    .Encode((value) => 1 as const)
  const T22 = Type.Transform(T21)
    .Decode((value) => 3 as const)
    .Encode((value) => 2 as const)
  const T23 = Type.Transform(T22)
    .Decode((value) => 4 as const)
    .Encode((value) => 3 as const)
  it('Should decode mapped', () => {
    const R = Value.Decode(T23, 1)
    Assert.IsEqual(R, 4)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T23, 4)
    Assert.IsEqual(R, 1)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T23, null))
  })
})
