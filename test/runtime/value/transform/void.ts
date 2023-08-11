import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Void', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Void())
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, undefined)
    Assert.IsEqual(R, undefined)
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, undefined)
    Assert.IsEqual(R, undefined)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Void())
    .Decode((value) => null)
    .Encode((value) => undefined)
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, undefined)
    Assert.IsEqual(R, null)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, null)
    Assert.IsEqual(R, undefined)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
})
