import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Ref', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const N0 = Type.Number({ $id: 'N0' })
  const T0 = Type.Transform(Type.Ref('N0'))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T0, [N0], 0)
    Assert.IsEqual(R, 0)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T0, [N0], 0)
    Assert.IsEqual(R, 0)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const N1 = Type.Number({ $id: 'N1' })
  const T1 = Type.Transform(Type.Unsafe<number>(Type.Ref('N1')))
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, [N1], 0)
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, [N1], 1)
    Assert.IsEqual(R, 0)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
  // --------------------------------------------------------
  // Mapped Remote
  // --------------------------------------------------------
  const N2 = Type.Transform(Type.Number({ $id: 'N2' }))
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  const T2 = Type.Transform(Type.Unsafe<number>(Type.Ref('N2')))
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  it('Should decode mapped remote', () => {
    const R = Encoder.Decode(T2, [N2], 0)
    Assert.IsEqual(R, 2)
  })
  it('Should encode mapped remote', () => {
    const R = Encoder.Encode(T2, [N2], 2)
    Assert.IsEqual(R, 0)
  })
  it('Should throw on mapped remote decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
})
