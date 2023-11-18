import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Recursive', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(
    Type.Recursive((This) =>
      Type.Object({
        value: Type.Number(),
        nodes: Type.Array(This),
      }),
    ),
  )
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, {
      value: 1,
      nodes: [
        { value: 2, nodes: [] },
        { value: 3, nodes: [] },
      ],
    })
    Assert.IsEqual(R, {
      value: 1,
      nodes: [
        { value: 2, nodes: [] },
        { value: 3, nodes: [] },
      ],
    })
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, {
      value: 1,
      nodes: [
        { value: 2, nodes: [] },
        { value: 3, nodes: [] },
      ],
    })
    Assert.IsEqual(R, {
      value: 1,
      nodes: [
        { value: 2, nodes: [] },
        { value: 3, nodes: [] },
      ],
    })
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, undefined))
  })
  // -----------------------------------------------
  // Mapped
  // -----------------------------------------------
  const T1 = Type.Transform(
    Type.Recursive((This) =>
      Type.Object({
        value: Type.Number(),
        nodes: Type.Array(This),
      }),
    ),
  )
    .Decode((value) => 1)
    .Encode((value) => ({ value: 1, nodes: [] }))
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, {
      value: 1,
      nodes: [
        { value: 2, nodes: [] },
        { value: 3, nodes: [] },
      ],
    })
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsEqual(R, { value: 1, nodes: [] })
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
  // -----------------------------------------------
  // Recursive Property Remap
  // -----------------------------------------------
  const N2 = Type.Transform(Type.Number())
    .Decode((value) => new Date(value))
    .Encode((value) => value.getTime())
  const T2 = Type.Recursive((This) =>
    Type.Object({
      value: N2,
      nodes: Type.Array(This),
    }),
  )
  it('Should decode property', () => {
    const R = Encoder.Decode(T2, {
      value: 1,
      nodes: [
        { value: 2, nodes: [] },
        { value: 3, nodes: [] },
      ],
    })
    Assert.IsEqual(R, {
      value: new Date(1),
      nodes: [
        { value: new Date(2), nodes: [] },
        { value: new Date(3), nodes: [] },
      ],
    })
  })
  it('Should encode property', () => {
    const R = Encoder.Encode(T2, {
      value: new Date(1),
      nodes: [
        { value: new Date(2), nodes: [] },
        { value: new Date(3), nodes: [] },
      ],
    })
    Assert.IsEqual(R, {
      value: 1,
      nodes: [
        { value: 2, nodes: [] },
        { value: 3, nodes: [] },
      ],
    })
  })
  it('Should throw on decode property', () => {
    Assert.Throws(() => Encoder.Decode(T2, null))
  })
})
