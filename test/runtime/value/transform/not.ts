import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Not', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Not(Type.String()))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, 1)
    Assert.IsEqual(R, 1)
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, 1)
    Assert.IsEqual(R, 1)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, ''))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Not(Type.String()))
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
  it('Should throw on decode not', () => {
    Assert.Throws(() => Encoder.Decode(T1, 'hello'))
  })
})
