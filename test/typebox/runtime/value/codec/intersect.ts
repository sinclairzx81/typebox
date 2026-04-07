import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Intersect')

// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
Test('Should Intersect 1', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([
    Type.Object({ x: NumberToString }),
    Type.Object({ y: NumberToString })
  ])
  const D = Value.Decode(T, { x: 1, y: 2 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Additional
// ------------------------------------------------------------------
Test('Should Intersect 2', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([
    Type.Object({ x: NumberToString }),
    Type.Object({ y: NumberToString })
  ])

  const D = Value.Decode(T, { x: 1, y: 2, z: 3 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Primative
// ------------------------------------------------------------------
Test('Should Intersect 3', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([NumberToString, Type.Number()])
  const D = Value.Decode(T, 1)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '1')
  Assert.IsEqual(E, 1)
})
Test('Should Intersect 4', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([Type.Number(), NumberToString])
  const D = Value.Decode(T, 1)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '1')
  Assert.IsEqual(E, 1)
})
// ------------------------------------------------------------------
// Illogical
// ------------------------------------------------------------------
Test('Should Intersect 5', () => {
  const T = Type.Intersect([Type.Array(Type.Null()), Type.Number()])
  Assert.Throws(() => Value.Decode(T, 1))
  Assert.Throws(() => Value.Encode(T, [null]))
})
// ------------------------------------------------------------------
// Intersect Operand Should Not Break Subsequent Operands
//
// https://github.com/sinclairzx81/typebox/issues/1466
// ------------------------------------------------------------------
Test('Should Intersect 6', () => {
  let C = 0
  const T = Type.Codec(Type.Object({
    L: Type.String(),
    R: Type.String()
  }))
    .Decode((encoded) => (`${encoded.L}:${encoded.R}`))
    .Encode((decoded) => {
      C = C + 1
      const [L, R] = decoded.split(':') as [string, string]
      return { L, R }
    })
  const S = Type.Intersect([
    Type.Object({ id: T }),
    Type.Object({ id: T })
  ])
  const D = Value.Decode(S, { id: { L: 'L', R: 'R' } })
  const E = Value.Encode(S, D)
  // Expect Multiple Calls Per Operand
  Assert.IsEqual(C, 2)
  Assert.IsEqual(D, { id: 'L:R' })
  Assert.IsEqual(E, { id: { L: 'L', R: 'R' } })
})
// ------------------------------------------------------------------
// Intersect With Outer Codec
//
// Verifies the outer Intersect-level Codec is applied after merging
// interiors on Decode, and before on Encode.
// ------------------------------------------------------------------
Test('Should Intersect 7', () => {
  const T = Type.Codec(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ]))
    .Decode((value) => ({ ...value, decoded: true }))
    .Encode(({ decoded: _, ...rest }) => rest)

  const D = Value.Decode(T, { x: 1, y: 2 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: 1, y: 2, decoded: true })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Intersect Key Override
//
// Verifies that when two operands produce the same key, the latter
// operand's value wins on merge.
// ------------------------------------------------------------------
Test('Should Intersect 8', () => {
  const Increment = Type.Codec(Type.Number())
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)

  const T = Type.Intersect([
    Type.Object({ n: Type.Number() }),
    Type.Object({ n: Increment })
  ])
  const D = Value.Decode(T, { n: 1 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { n: 2 }) // latter operand wins
  Assert.IsEqual(E, { n: 1 })
})
// ------------------------------------------------------------------
// Empty Intersect
//
// Verifies that an Intersect with no operands decodes and encodes
// without error, returning an empty object.
// ------------------------------------------------------------------
Test('Should Intersect 9', () => {
  const T = Type.Intersect([])
  const D = Value.Decode(T, {})
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, {})
  Assert.IsEqual(E, {})
})
// ------------------------------------------------------------------
// Empty Intersect
//
// Verifies that an empty Intersect returns the original value
// unchanged for both Decode and Encode.
// ------------------------------------------------------------------
Test('Should Intersect 10', () => {
  const T = Type.Intersect([])
  const D = Value.Decode(T, 42)
  const E = Value.Encode(T, 42)
  Assert.IsEqual(D, 42)
  Assert.IsEqual(E, 42)
})
// ------------------------------------------------------------------
// Primitive With No Transformation
//
// Verifies that when no operand transforms the value,
// NonMatchingInterior correctly falls back to the first result.
// ------------------------------------------------------------------
Test('Should Intersect 11', () => {
  const T = Type.Intersect([Type.Number(), Type.Number()])
  const D = Value.Decode(T, 42)
  const E = Value.Encode(T, 42)
  Assert.IsEqual(D, 42)
  Assert.IsEqual(E, 42)
})
// ------------------------------------------------------------------
// Nested Intersect
//
// Verifies that codec transformation composes correctly when
// Intersect types are nested inside one another.
// ------------------------------------------------------------------
Test('Should Intersect 12', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const Inner = Type.Intersect([
    Type.Object({ x: NumberToString })
  ])
  const Outer = Type.Intersect([
    Inner,
    Type.Object({ y: NumberToString })
  ])
  const D = Value.Decode(Outer, { x: 1, y: 2 })
  const E = Value.Encode(Outer, D)
  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
