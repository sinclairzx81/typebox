import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/Iterator', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Iterator(Type.Number()))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, (function* (): any {})())
    Assert.IsTrue(Symbol.iterator in R)
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, (function* (): any {})())
    Assert.IsTrue(Symbol.iterator in R)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.Iterator(Type.Number()))
    .Decode((value) => 1)
    .Encode((value) => (function* (): any {})())
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, (function* (): any {})())
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsTrue(Symbol.iterator in R)
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
})
