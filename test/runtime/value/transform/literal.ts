import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Literal', () => {
  // -----------------------------------------------
  // Identity
  // -----------------------------------------------
  const T0 = Type.Transform(Type.Literal(123))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T0, 123)
    Assert.IsEqual(R, 123)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T0, 123)
    Assert.IsEqual(R, 123)
  })
  // -----------------------------------------------
  // LiteralString
  // -----------------------------------------------
  const T1 = Type.Transform(Type.Literal('hello'))
    .Decode((value) => 1)
    .Encode((value) => 'hello' as const)
  it('Should decode literal string', () => {
    const R = Encoder.Decode(T1, 'hello')
    Assert.IsEqual(R, 1)
  })
  it('Should encode literal string', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsEqual(R, 'hello')
  })
  it('Should throw on decode literal string', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
  // -----------------------------------------------
  // LiteralNumber
  // -----------------------------------------------
  const T2 = Type.Transform(Type.Literal(2))
    .Decode((value) => 1)
    .Encode((value) => 2 as const)
  it('Should decode literal number', () => {
    const R = Encoder.Decode(T2, 2)
    Assert.IsEqual(R, 1)
  })
  it('Should encode literal number', () => {
    const R = Encoder.Encode(T2, null)
    Assert.IsEqual(R, 2)
  })
  it('Should throw on decode literal number', () => {
    Assert.Throws(() => Encoder.Decode(T2, null))
  })
  // -----------------------------------------------
  // LiteralBoolean
  // -----------------------------------------------
  const T3 = Type.Transform(Type.Literal(true))
    .Decode((value) => 1)
    .Encode((value) => true as const)
  it('Should decode literal boolean', () => {
    const R = Encoder.Decode(T3, true)
    Assert.IsEqual(R, 1)
  })
  it('Should encode literal boolean', () => {
    const R = Encoder.Encode(T3, null)
    Assert.IsEqual(R, true)
  })
  it('Should throw on decode literal boolean', () => {
    Assert.Throws(() => Encoder.Decode(T3, null))
  })
})
