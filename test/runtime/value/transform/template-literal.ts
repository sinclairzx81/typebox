import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/TemplateLiteral', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.TemplateLiteral([Type.Literal('hello')]))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, 'hello')
    Assert.IsEqual(R, 'hello')
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, 'hello')
    Assert.IsEqual(R, 'hello')
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.TemplateLiteral([Type.Literal('ABC')]))
    .Decode((value) => value.split('').reverse().join('') as 'CBA')
    .Encode((value) => value.split('').reverse().join('') as 'ABC')
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, 'ABC')
    Assert.IsEqual(R, 'CBA')
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, 'CBA')
    Assert.IsEqual(R, 'ABC')
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
})
