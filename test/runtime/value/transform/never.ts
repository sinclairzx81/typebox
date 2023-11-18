import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Never', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Never())
    .Decode((value) => value)
    // @ts-ignore
    .Encode((value) => value)
  it('Should throw on identity encode', () => {
    Assert.Throws(() => Encoder.Encode(T0, undefined))
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, undefined))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Never())
    // @ts-ignore
    .Decode((value) => 1)
    // @ts-ignore
    .Encode((value) => 1)
  it('Should throw on mapped encode', () => {
    Assert.Throws(() => Encoder.Encode(T1, undefined))
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, undefined))
  })
})
