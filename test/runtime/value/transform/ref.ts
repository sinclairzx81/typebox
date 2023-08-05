import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Ref', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const N0 = Type.Number({ $id: 'N0' })
  const T0 = Type.Transform(Type.Ref(N0))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode mapped', () => {
    const R = Value.Decode(T0, [N0], 0)
    Assert.IsEqual(R, 0)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T0, [N0], 0)
    Assert.IsEqual(R, 0)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const N1 = Type.Number({ $id: 'N1' })
  const T1 = Type.Transform(Type.Ref(N1))
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, [N1], 0)
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, [N1], 1)
    Assert.IsEqual(R, 0)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
  // --------------------------------------------------------
  // Mapped Remote
  // --------------------------------------------------------
  const N2 = Type.Transform(Type.Number({ $id: 'N2' }))
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  const T2 = Type.Transform(Type.Ref(N2))
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  it('Should decode mapped remote', () => {
    const R = Value.Decode(T2, [N2], 0)
    Assert.IsEqual(R, 2)
  })
  it('Should encode mapped remote', () => {
    const R = Value.Encode(T2, [N2], 2)
    Assert.IsEqual(R, 0)
  })
  it('Should throw on mapped remote decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
})
