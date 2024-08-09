import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Type } from '@sinclair/typebox'

describe('value/transform/Record', () => {
  // ------------------------------------------------------------
  // Identity
  // ------------------------------------------------------------
  const T0 = Type.Transform(Type.Record(Type.String(), Type.Boolean()))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, {
      a: true,
      b: false,
    })
    Assert.IsEqual(R, {
      a: true,
      b: false,
    })
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, {
      a: true,
      b: false,
    })
    Assert.IsEqual(R, {
      a: true,
      b: false,
    })
  })
  it('Should throw on identity', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // ------------------------------------------------------------
  // Additional Properties True
  // ------------------------------------------------------------
  const N1 = Type.Transform(Type.Number())
    .Decode((value) => `number-${value.toString()}`)
    .Encode((value) => parseFloat(value.replace(/number-/g, '')))
  const T1 = Type.Record(Type.Number(), N1)
  it('Should decode additional properties allowed', () => {
    const R = Encoder.Decode(T1, {
      0: 1,
      a: true,
    })
    Assert.IsEqual(R, {
      0: 'number-1',
      a: true,
    })
  })
  it('Should encode additional properties allowed', () => {
    const R = Encoder.Encode(T1, {
      0: 'number-1',
      a: true,
    })
    Assert.IsEqual(R, {
      0: 1,
      a: true,
    })
  })
  it('Should throw on additional properties allowed', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
  // ------------------------------------------------------------
  // Complex Transform
  // ------------------------------------------------------------
  const N2 = Type.Transform(Type.Number())
    .Decode((value) => `number-${value.toString()}`)
    .Encode((value) => parseFloat(value.replace(/number-/g, '')))
  const B2 = Type.Transform(Type.Boolean())
    .Decode((value) => (value ? 'TRUE' : 'FALSE'))
    .Encode((value) => (value === 'TRUE' ? true : false))
  const T3 = Type.Record(Type.Number(), N2, { additionalProperties: B2 })
  it('Should decode complex', () => {
    const R = Encoder.Decode(T3, {
      0: 1,
      a: true,
    })
    Assert.IsEqual(R, {
      0: 'number-1',
      a: 'TRUE',
    })
  })
  it('Should encode complex', () => {
    const R = Encoder.Encode(T3, {
      0: 'number-1',
      a: 'TRUE',
    })
    Assert.IsEqual(R, {
      0: 1,
      a: true,
    })
  })
  it('Should throw on complex decode', () => {
    Assert.Throws(() => Encoder.Decode(T3, null))
  })
  // ------------------------------------------------------------
  // Map
  // ------------------------------------------------------------
  const T4 = Type.Transform(Type.Record(Type.String(), Type.String()))
    .Decode((value) => new Map(Object.entries(value)))
    .Encode((value) => Object.fromEntries(value.entries()))
  it('should decode map', () => {
    const R = Encoder.Decode(T4, { x: 'hello', y: 'world' })
    Assert.IsInstanceOf(R, Map)
    Assert.IsEqual(R.get('x'), 'hello')
    Assert.IsEqual(R.get('y'), 'world')
  })
  it('should encode map', () => {
    const R = Encoder.Encode(
      T4,
      new Map([
        ['x', 'hello'],
        ['y', 'world'],
      ]),
    )
    Assert.IsEqual(R, { x: 'hello', y: 'world' })
  })
  it('Should throw on map decode', () => {
    Assert.Throws(() => Encoder.Decode(T4, null))
  })
})
