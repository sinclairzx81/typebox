import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Tuple', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Tuple([Type.Number(), Type.Number()]))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, [1, 2])
    Assert.IsEqual(R, [1, 2])
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, [1, 2])
    Assert.IsEqual(R, [1, 2])
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Tuple([Type.Number()]))
    .Decode((value) => [value[0] + 1] as [number])
    .Encode((value) => [value[0] - 1] as [number])
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, [0])
    Assert.IsEqual(R, [1])
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, [1])
    Assert.IsEqual(R, [0])
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
  // --------------------------------------------------------
  // Mapped Element
  // --------------------------------------------------------
  const N2 = Type.Transform(Type.Number())
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  const T2 = Type.Transform(Type.Tuple([N2]))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode mapped element', () => {
    const R = Encoder.Decode(T2, [0])
    Assert.IsEqual(R, [1])
  })
  it('Should encode mapped element', () => {
    const R = Encoder.Encode(T2, [1])
    Assert.IsEqual(R, [0])
  })
  it('Should throw on mapped element decode', () => {
    Assert.Throws(() => Encoder.Decode(T2, null))
  })
  // --------------------------------------------------------
  // Mapped Element
  // --------------------------------------------------------
  const N3 = Type.Transform(Type.Number())
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  const T3 = Type.Transform(Type.Tuple([N3]))
    .Decode((value) => [value[0].toString()])
    .Encode((value) => [parseFloat(value[0])] as [number])
  it('Should decode mapped element', () => {
    const R = Encoder.Decode(T3, [0])
    Assert.IsEqual(R, ['1'])
  })
  it('Should encode mapped element', () => {
    const R = Encoder.Encode(T3, ['1'])
    Assert.IsEqual(R, [0])
  })
  it('Should throw on mapped element decode', () => {
    Assert.Throws(() => Encoder.Decode(T3, null))
  })
  // ------------------------------------------------------------
  // Set
  // ------------------------------------------------------------
  const T4 = Type.Transform(Type.Tuple([Type.Number()]))
    .Decode((value) => new Set(value))
    .Encode((value) => [...value] as any)
  it('should decode set', () => {
    const R = Encoder.Decode(T4, [1])
    Assert.IsInstanceOf(R, Set)
    Assert.IsTrue(R.has(1))
  })
  it('should encode set', () => {
    const R = Encoder.Encode(T4, new Set([1]))
    Assert.IsEqual(R, [1])
  })
  it('Should throw on set decode', () => {
    Assert.Throws(() => Encoder.Decode(T4, {}))
  })
})
