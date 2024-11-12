import * as Encoder from './_encoder'
import { Assert } from '../../assert'

import { TypeSystemPolicy } from '@sinclair/typebox/system'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

// prettier-ignore
describe('value/transform/Import', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(
    Type.Module({ A: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })}).Import('A'),
  )
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, undefined))
  })
  // ----------------------------------------------------------
  // Object
  // ----------------------------------------------------------
  const T1 = Type.Transform(
    Type.Module({ A: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })}).Import('A'),
  )
    .Decode((value) => 42)
    .Encode((value) => ({ x: 1, y: 2 }))
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, { x: 1, y: 2 })
    Assert.IsEqual(R, 42)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, undefined))
  })
  // ----------------------------------------------------------
  // Object: Transform Property
  // ----------------------------------------------------------
  const N2 = Type.Transform(Type.Module({ A: Type.Integer() }).Import('A'))
    .Decode((value) => value.toString())
    .Encode((value) => parseInt(value))
  const T2 = Type.Object({
    x: N2,
    y: N2,
  })
  it('Should decode transform property', () => {
    const R = Encoder.Decode(T2, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: '1', y: '2' })
  })
  it('Should encode transform property', () => {
    const R = Encoder.Encode(T2, { x: '1', y: '2' })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should throw on decode transform property', () => {
    Assert.Throws(() => Encoder.Decode(T2, undefined))
  })
  // ----------------------------------------------------------
  // Object: Transform Property Nested (Twizzle)
  // ----------------------------------------------------------
  const N3 = Type.Transform(Type.Module({ A: Type.Integer() }).Import('A'))
    .Decode((value) => value.toString())
    .Encode((value) => parseInt(value))
  const T3 = Type.Transform(
    Type.Object({
      x: N3,
      y: N3,
    }),
  )
    .Decode((value) => ({ x: value.y, y: value.x }))
    .Encode((value) => ({ x: value.y, y: value.x }))
  it('Should decode transform property nested', () => {
    const R = Encoder.Decode(T3, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: '2', y: '1' })
  })
  it('Should encode transform property nested', () => {
    const R = Encoder.Encode(T3, { x: '1', y: '2' })
    Assert.IsEqual(R, { x: 2, y: 1 })
  })
  it('Should throw on decode transform property nested', () => {
    Assert.Throws(() => Encoder.Decode(T3, undefined))
  })
  // ----------------------------------------------------------
  // Object Additional Properties
  // ----------------------------------------------------------
  const N4 = Type.Transform(Type.Module({ A: Type.Integer() }).Import('A'))
    .Decode((value) => value.toString())
    .Encode((value) => parseInt(value))
  const T4 = Type.Transform(
    Type.Object(
      {
        x: Type.Number(),
      },
      {
        additionalProperties: N4,
      },
    ),
  )
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode additional property', () => {
    const R = Encoder.Decode(T4, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: '2' })
  })
  it('Should encode additional property', () => {
    const R = Encoder.Encode(T4, { x: 1, y: '5' })
    Assert.IsEqual(R, { x: 1, y: 5 })
  })
  it('Should throw on additional property 1', () => {
    Assert.Throws(() => Encoder.Decode(T4, undefined))
  })
  it('Should throw on additional property 2', () => {
    Assert.Throws(() => Encoder.Decode(T4, { x: 1, y: true }))
  })
  // ------------------------------------------------------------
  // Map
  // ------------------------------------------------------------
  const T5 = Type.Transform(Type.Module({ A: Type.Object({ x: Type.String(), y: Type.String() })}).Import('A'))
    .Decode((value) => new Map(Object.entries(value)))
    .Encode((value) => Object.fromEntries(value.entries()) as any)
  it('should decode map', () => {
    const R = Encoder.Decode(T5, { x: 'hello', y: 'world' })
    Assert.IsInstanceOf(R, Map)
    Assert.IsEqual(R.get('x'), 'hello')
    Assert.IsEqual(R.get('y'), 'world')
  })
  it('should encode map', () => {
    const R = Encoder.Encode(
      T5,
      new Map([
        ['x', 'hello'],
        ['y', 'world'],
      ]),
    )
    Assert.IsEqual(R, { x: 'hello', y: 'world' })
  })
  it('Should throw on map decode', () => {
    Assert.Throws(() => Encoder.Decode(T5, {}))
  })
})
