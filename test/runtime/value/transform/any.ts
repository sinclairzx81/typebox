import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Any', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Any())
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T0, 123)
    Assert.IsEqual(R, 123)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T0, 123)
    Assert.IsEqual(R, 123)
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Any())
    .Decode((value) => 1)
    .Encode((value) => 2)
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, null)
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsEqual(R, 2)
  })
})
