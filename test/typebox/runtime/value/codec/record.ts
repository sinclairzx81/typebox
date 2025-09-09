// deno-fmt-ignore-file

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Record')

// ------------------------------------------------------------------
// Codec Properties
// ------------------------------------------------------------------
Test('Should Record 1', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode(value => value.toString())
    .Encode(value => parseFloat(value))
  const A = Type.Record(Type.String(), NumberToString)
  const D = Value.Decode(A, { x: 1, y: 2 })
  const E = Value.Encode(A, D)
  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Ensure Trancate unknown Properties
// ------------------------------------------------------------------
Test('Should Record 2', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode(value => value.toString())
    .Encode(value => parseFloat(value))
  const A = Type.Record(Type.Number(), NumberToString)
  const D = Value.Decode(A, { x: 1, y: 2 })
  const E = Value.Encode(A, D)
  Assert.IsEqual(D, { })
  Assert.IsEqual(E, { })
})
// ------------------------------------------------------------------
// Record with Codec
// ------------------------------------------------------------------
Test('Should Record 3', () => {
  const Augment = Type.Codec(Type.Record(Type.String(), Type.Number()))
    .Decode(value => ({ 'foo': 1, ...value }))
    .Encode(value => {
      const { foo, ...rest } = value
      return rest
    })
  const D = Value.Decode(Augment, { x: 1, y: 2 })
  const E = Value.Encode(Augment, D)
  Assert.IsEqual(D, { foo: 1, x: 1, y: 2 })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Only Transform Known
// ------------------------------------------------------------------
Test('Should Record 4', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode(value => value.toString())
    .Encode(value => parseFloat(value))

  const A = Type.Record(Type.Number(), NumberToString)
  const D = Value.Decode(A, { x: 1, y: 2, 0: 3 })
  const E = Value.Encode(A, D)
  Assert.IsEqual(D, { 0: '3' })
  Assert.IsEqual(E, { 0: 3 })
})
// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
Test('Should Record 5', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode(value => value.toString())
    .Encode(value => parseFloat(value))
  const A = Type.Record(Type.Number(), NumberToString)
  Assert.Throws(() => Value.Decode(A, null))
  Assert.Throws(() => Value.Encode(A, null))
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Record 6', () => {
  const Identity = Type.Codec(Type.Record(Type.Number(), Type.String()))
    .Decode(value => value)
    .Encode(value => value)
  const D = Value.Decode(Identity, { x: 1 })
  const E = Value.Encode(Identity, { x: 1 })
  Assert.IsEqual(D, { })
  Assert.IsEqual(E, { })
})