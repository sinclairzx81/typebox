import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Array', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Array(Type.Number()))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T0, [0, 1, 2])
    Assert.IsEqual(R, [0, 1, 2])
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T0, [0, 1, 2])
    Assert.IsEqual(R, [0, 1, 2])
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Array(Type.Number()))
    .Decode((value) => 1)
    .Encode((value) => [0, 1, 2])
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, [])
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsEqual(R, [0, 1, 2])
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
  // --------------------------------------------------------
  // Elements
  // --------------------------------------------------------
  const B2 = Type.Transform(Type.Boolean())
    .Decode((value) => (value ? 'TRUE' : 'FALSE'))
    .Encode((value) => (value === 'TRUE' ? true : false))
  const T2 = Type.Array(B2)
  it('Should decode elements', () => {
    const R = Encoder.Decode(T2, [true, false])
    Assert.IsEqual(R, ['TRUE', 'FALSE'])
  })
  it('Should encode elements', () => {
    const R = Encoder.Encode(T2, ['TRUE', 'FALSE'])
    Assert.IsEqual(R, [true, false])
  })
  it('Should throw on elements decode', () => {
    Assert.Throws(() => Encoder.Decode(T2, null))
  })
  // --------------------------------------------------------
  // Elements Contains (Not Supported)
  // --------------------------------------------------------
  const N3 = Type.Transform(Type.Literal(1))
    .Decode((value) => 'hello')
    .Encode((value) => 1 as const)
  const T3 = Type.Array(Type.Number(), {
    contains: N3,
  })
  it('Should decode contains', () => {
    const R = Encoder.Decode(T3, [1, 2, 3])
    Assert.IsEqual(R, [1, 2, 3])
  })
  it('Should throw on contains encode', () => {
    Assert.Throws(() => Encoder.Encode(T3, ['hello', 2, 3]))
  })
  it('Should throw on contains decode', () => {
    Assert.Throws(() => Encoder.Decode(T3, null))
  })
  // ------------------------------------------------------------
  // Set
  // ------------------------------------------------------------
  const T4 = Type.Transform(Type.Array(Type.Number()))
    .Decode((value) => new Set(value))
    .Encode((value) => [...value])
  it('should decode set', () => {
    const R = Encoder.Decode(T4, [1, 1, 2, 3])
    Assert.IsInstanceOf(R, Set)
    Assert.IsTrue(R.has(1))
    Assert.IsTrue(R.has(2))
    Assert.IsTrue(R.has(3))
  })
  it('should encode set', () => {
    const R = Encoder.Encode(T4, new Set([1, 2, 3]))
    Assert.IsEqual(R, [1, 2, 3])
  })
  it('Should throw on set decode', () => {
    Assert.Throws(() => Encoder.Decode(T4, {}))
  })
})
