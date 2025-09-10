// deno-fmt-ignore-file

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Object')

// ------------------------------------------------------------------
// Interior
// ------------------------------------------------------------------
Test('Should Object 1', () => {
  const UnknownToBoxed = Type.Codec(Type.Unknown())
    .Decode(value => { return ({ value }) })
    .Encode(value => { return value.value })
  const T = Type.Object({
    x: UnknownToBoxed,
    y: UnknownToBoxed
  })
  const D = Value.Decode(T, { x: 1, y: 2 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: { value: 1 }, y: { value: 2 } })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Exterior
// ------------------------------------------------------------------
Test('Should Object 2', () => {
  const UnknownToBoxed = Type.Codec(Type.Unknown())
    .Decode(value => { return ({ value }) })
    .Encode(value => { return value.value })
  const ObjectToTuple = Type.Codec(Type.Object({
    x: UnknownToBoxed,
    y: UnknownToBoxed
  }))
  .Decode(value => [value.x, value.y])
  .Encode(value => ({ x: value[0], y: value[1] }))
  const D = Value.Decode(ObjectToTuple, { x: 1, y: 2 })
  const E = Value.Encode(ObjectToTuple, D)
  Assert.IsEqual(D, [{ value: 1 }, { value: 2 }])
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Interior: Additional
// ------------------------------------------------------------------
Test('Should Object 3', () => {
  const UnknownToBoxed = Type.Codec(Type.Unknown())
    .Decode(value => { return ({ value }) })
    .Encode(value => { return value.value })
  const T = Type.Object({
    x: UnknownToBoxed,
    y: UnknownToBoxed
  })
  const D = Value.Decode(T, { x: 1, y: 2, z: 3 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: { value: 1 }, y: { value: 2 } })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Exterior: Additional
// ------------------------------------------------------------------
Test('Should Object 4', () => {
  const UnknownToBoxed = Type.Codec(Type.Unknown())
    .Decode(value => { return ({ value }) })
    .Encode(value => { return value.value })
  const ObjectToTuple = Type.Codec(Type.Object({
    x: UnknownToBoxed,
    y: UnknownToBoxed
  }))
  .Decode(value => [value.x, value.y])
  .Encode(value => ({ x: value[0], y: value[1] }))
  const D = Value.Decode(ObjectToTuple, { x: 1, y: 2, z: 3 })
  const E = Value.Encode(ObjectToTuple, D)
  Assert.IsEqual(D, [{ value: 1 }, { value: 2 }])
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
Test('Should Object 5', () => {
  const UnknownToBoxed = Type.Codec(Type.Unknown())
    .Decode(value => { return ({ value }) })
    .Encode(value => { return value.value })
  const T = Type.Object({
    x: UnknownToBoxed,
    y: UnknownToBoxed
  })
  Assert.Throws(() => Value.Decode(T, null))
  Assert.Throws(() => Value.Encode(T, null))
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Object 6', () => {
  const Identity = Type.Codec(Type.Object({
    x: Type.Number(),
    y: Type.Number(),
  }))
  .Decode(value => value)
  .Encode(value => value)
  const D = Value.Decode(Identity, { x: 1, y: 2, z: 3 })
  const E = Value.Encode(Identity, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(D, { x: 1, y: 2 })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
Test('Should Object 7', () => {
  const Identity = Type.Codec(Type.Object({
    x: Type.Number(),
    y: Type.Number({ default: 1 }),
  })).Decode(value => value)
     .Encode(value => value)
  const D = Value.Decode(Identity, { x: 1 })
  const E = Value.Encode(Identity, { x: 1 })
  Assert.IsEqual(D, { x: 1, y: 1 })
  Assert.IsEqual(E, { x: 1, y: 1 })
})
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1318
// ------------------------------------------------------------------
Test('Should Object 8', () => {
  const T = Type.Object({
    x: Type.Optional(Type.Number())
  })
  const D = Value.Decode(T, {})
  const E = Value.Encode(T, {})
  Assert.IsEqual(D, { })
  Assert.IsEqual(E, { })
})
