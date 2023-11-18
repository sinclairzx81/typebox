import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Undefined', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Undefined())
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, undefined)
    Assert.IsEqual(R, undefined)
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, undefined)
    Assert.IsEqual(R, undefined)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Undefined())
    .Decode((value) => null)
    .Encode((value) => undefined)
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, undefined)
    Assert.IsEqual(R, null)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsEqual(R, undefined)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
})
