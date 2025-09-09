// deno-fmt-ignore-file

import { Guard } from 'typebox/guard'
import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Union')

// ------------------------------------------------------------------
// Nullable
// ------------------------------------------------------------------
const NumberToString = Type.Codec(Type.Number())
  .Decode(value => { return value.toString() })
  .Encode(value => { return parseFloat(value) })

Test('Should Union 1', () => {
  const T = Type.Union([Type.Null(), NumberToString])
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, null)
  Assert.IsEqual(E, null)
})
Test('Should Union 2', () => {
  const T = Type.Union([Type.Null(), NumberToString])
  const D = Value.Decode(T, 100)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '100')
  Assert.IsEqual(E, 100)
})
Test('Should Union 3', () => {
  const T = Type.Codec(Type.Union([Type.Null(), NumberToString]))
  .Decode(value => Guard.IsEqual(value, null) ? 'is null' : value)
  .Encode(value => Guard.IsEqual(value, 'is null') ? null : value)
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, 'is null')
  Assert.IsEqual(E, null)
})
// ------------------------------------------------------------------
// Nullable: Reversed
// ------------------------------------------------------------------
Test('Should Union 4', () => {
  const T = Type.Union([NumberToString, Type.Null()])
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, null)
  Assert.IsEqual(E, null)
})
Test('Should Union 5', () => {
  const T = Type.Union([NumberToString, Type.Null()])
  const D = Value.Decode(T, 100)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '100')
  Assert.IsEqual(E, 100)
})
Test('Should Union 6', () => {
  const T = Type.Codec(Type.Union([NumberToString, Type.Null()]))
  .Decode(value => Guard.IsEqual(value, null) ? 'is null' : value)
  .Encode(value => Guard.IsEqual(value, 'is null') ? null : value)
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, 'is null')
  Assert.IsEqual(E, null)
})
// ------------------------------------------------------------------
// Multi Variant
// ------------------------------------------------------------------
const StringToLiteral = Type.Codec(Type.String())
  .Decode(value => 'string' as const)
  .Encode(value => 'string')
const NumberToLiteral = Type.Codec(Type.Number())
  .Decode(value => 'number' as const)
  .Encode(value => 0)
const BooleanToLiteral = Type.Codec(Type.Boolean())
  .Decode(value => 'boolean' as const)
  .Encode(value => false)

const MultiVariant = Type.Union([
  StringToLiteral, // first 
  NumberToLiteral,
  BooleanToLiteral
])
Test('Should Union 7', () => {
  const D = Value.Decode(MultiVariant, 'hello')
  const E = Value.Encode(MultiVariant, D)
  Assert.IsEqual(D, 'string')
  Assert.IsEqual(E, 'string')
})
Test('Should Union 8', () => {
  const D = Value.Decode(MultiVariant, 1)
  const E = Value.Encode(MultiVariant, D)
  Assert.IsEqual(D, 'number')
  Assert.IsEqual(E, 'string')
})
Test('Should Union 9', () => {
  const D = Value.Decode(MultiVariant, true)
  const E = Value.Encode(MultiVariant, D)
  Assert.IsEqual(D, 'boolean')
  Assert.IsEqual(E, 'string')
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Union 10', () => {
  const Identity = Type.Codec(Type.Union([
    Type.Literal(1),
    Type.Literal(2)
  ]))
  .Decode(value => value)
  .Encode(value => value)
  Assert.Throws(() => Value.Decode(Identity, 3))
  Assert.Throws(() => Value.Encode(Identity, 3))
})
