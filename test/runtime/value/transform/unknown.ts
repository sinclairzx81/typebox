import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Unknown', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Unknown())
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode mapped', () => {
    const R = Value.Decode(T0, 123)
    Assert.IsEqual(R, 123)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T0, 123)
    Assert.IsEqual(R, 123)
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Unknown())
    .Decode((value) => 1)
    .Encode((value) => 2)
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, null)
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, null)
    Assert.IsEqual(R, 2)
  })
})
