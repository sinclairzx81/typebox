import * as Encoder from './_encoder'
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
    const R = Encoder.Decode(T0, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
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
    const R = Encoder.Decode(T1, { x: 1, y: 2 })
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
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
    const R = Encoder.Decode(T2, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: '2' })
  })
  it('Should encode property', () => {
    const R = Encoder.Encode(T2, { x: 1, y: '2' })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on property decode', () => {
    Assert.Throws(() => Encoder.Decode(T2, null))
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
    const R = Encoder.Decode(T3, { x: 1, y: 2, z: 3 })
    Assert.IsEqual(R, { x: 1, y: 2, z: '3' })
  })
  it('Should encode unevaluated property', () => {
    const R = Encoder.Encode(T3, { x: 1, y: 2, z: '3' })
    Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
  })
  it('Should throw on unevaluated property decode', () => {
    Assert.Throws(() => Encoder.Decode(T3, null))
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
    const R = Encoder.Decode(T4, 1)
    Assert.IsEqual(R, 2)
  })
  it('Should encode exterior value type', () => {
    const R = Encoder.Encode(T4, 2)
    Assert.IsEqual(R, 1)
  })
  it('Should throw on exterior value type decode', () => {
    Assert.Throws(() => Encoder.Decode(T4, null))
  })
  // --------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/discussions/672
  // --------------------------------------------------------
  // prettier-ignore
  {
    const A = Type.Object({ isHybrid: Type.Boolean() })
    const T = Type.Transform(A)
      .Decode((value) => ({ isHybrid: value.isHybrid ? 1 : 0 }))
      .Encode((value) => ({ isHybrid: value.isHybrid === 1 ? true : false }))
    const I = Type.Intersect([
      Type.Object({ model: Type.String() }),
      Type.Object({ features: Type.Array(T) }),
    ])
    it('Should decode nested 1', () => {
      const value = Value.Decode(T, { isHybrid: true })
      Assert.IsEqual(value, { isHybrid: 1 })
    })
    // prettier-ignore
    it('Should decode nested 2', () => {
      const value = Value.Decode(I, {
        model: 'Prius',
        features: [
          { isHybrid: true },
          { isHybrid: false }
        ],
      })
      Assert.IsEqual(value, {
        model: 'Prius',
        features: [
          { isHybrid: 1 },
          { isHybrid: 0 }
        ],
      })
    })
    it('should encode nested 1', () => {
      let value = Value.Encode(T, { isHybrid: 1 })
      Assert.IsEqual(value, { isHybrid: true })
    })
    // prettier-ignore
    it('Should encode nested 2', () => {
      const value = Value.Encode(I, {
        model: 'Prius',
        features: [
          { isHybrid: 1 },
          { isHybrid: 0 }
        ],
      })
      Assert.IsEqual(value, {
        model: 'Prius',
        features: [
          { isHybrid: true },
          { isHybrid: false }

        ],
      })
    })
  }
})
