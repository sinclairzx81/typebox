import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

describe('value/transform/AsyncIterator', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.AsyncIterator(Type.Number()))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, (async function* (): any {})())
    Assert.IsTrue(Symbol.asyncIterator in R)
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, (async function* (): any {})())
    Assert.IsTrue(Symbol.asyncIterator in R)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Type.AsyncIterator(Type.Number()))
    .Decode((value) => 1)
    .Encode((value) => (async function* (): any {})())
  it('Should decode', () => {
    const R = Encoder.Decode(T1, (async function* (): any {})())
    Assert.IsEqual(R, 1)
  })
  it('Should encode', () => {
    const R = Encoder.Encode(T1, null)
    Assert.IsTrue(Symbol.asyncIterator in R)
  })
  it('Should throw on decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
})
