import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Intersect', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  // prettier-ignore
  const T0 = Type.Transform(Type.Intersect([
    Type.Object({ x: Type.Number() }), 
    Type.Object({ y: Type.Number() })
  ]))
  .Decode(value => value)
  .Encode(value => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  // prettier-ignore
  const T1 = Type.Transform(Type.Intersect([
    Type.Object({ x: Type.Number() }), 
    Type.Object({ y: Type.Number() })
  ]))
  .Decode((value) => 1)
  .Encode((value) => ({ x: 1, y: 2 }))
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, { x: 1, y: 2 })
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, null)
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
  // --------------------------------------------------------
  // Mapped Property
  // --------------------------------------------------------
  const N2 = Type.Transform(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))
  // prettier-ignore
  const T2 = Type.Transform(Type.Intersect([
    Type.Object({ x: Type.Number() }), 
    Type.Object({ y: N2 })
  ]))
  .Decode((value) => value)
  .Encode((value) => value)
  it('Should decode property', () => {
    const R = Value.Decode(T2, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: '2' })
  })
  it('Should encode property', () => {
    const R = Value.Encode(T2, { x: 1, y: '2' })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on property decode', () => {
    Assert.Throws(() => Value.Decode(T2, null))
  })
  // --------------------------------------------------------
  // Unevaluated Property
  // --------------------------------------------------------
  const N3 = Type.Transform(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))
  // prettier-ignore
  const T3 = Type.Intersect([
    Type.Object({ x: Type.Number() }), 
    Type.Object({ y: Type.Number() })
  ], {
    unevaluatedProperties: N3
  })
  it('Should decode unevaluated property', () => {
    const R = Value.Decode(T3, { x: 1, y: 2, z: 3 })
    Assert.IsEqual(R, { x: 1, y: 2, z: '3' })
  })
  it('Should encode unevaluated property', () => {
    const R = Value.Encode(T3, { x: 1, y: 2, z: '3' })
    Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
  })
  it('Should throw on unevaluated property decode', () => {
    Assert.Throws(() => Value.Decode(T3, null))
  })
  // --------------------------------------------------------
  // Transform Intersection Interior (Not Supported)
  // --------------------------------------------------------
  it('Should throw on intersected interior transform types', () => {
    const N4 = Type.Transform(Type.Number())
      .Decode((value) => value)
      .Encode((value) => value)
    Assert.Throws(() => Type.Intersect([N4, N4]))
  })
  // --------------------------------------------------------
  // Transform Intersection Exterior
  // --------------------------------------------------------
  const T4 = Type.Transform(Type.Intersect([Type.Number(), Type.Number()]))
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  it('Should decode exterior value type', () => {
    const R = Value.Decode(T4, 1)
    Assert.IsEqual(R, 2)
  })
  it('Should encode exterior value type', () => {
    const R = Value.Encode(T4, 2)
    Assert.IsEqual(R, 1)
  })
  it('Should throw on exterior value type decode', () => {
    Assert.Throws(() => Value.Decode(T4, null))
  })
})
