import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Literal')

// ------------------------------------------------------------------
// LiteralString
// ------------------------------------------------------------------
Test('LiteralString: Should convert 1', () => {
  const T = Type.Literal('1')
  const R = Value.Convert(T, 1)
  Assert.IsEqual(R, '1')
})
Test('LiteralString: Should convert 2', () => {
  const T = Type.Literal('1')
  const R = Value.Convert(T, 2)
  Assert.IsEqual(R, 2)
})
Test('LiteralString: Should convert 3', () => {
  const T = Type.Literal('true')
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, 'true')
})
// ------------------------------------------------------------------
// LiteralNumber
// ------------------------------------------------------------------
Test('LiteralNumber: Should convert 1', () => {
  const T = Type.Literal(3.14)
  const R = Value.Convert(T, '3.14')
  Assert.IsEqual(R, 3.14)
})
Test('LiteralNumber: Should convert 2', () => {
  const T = Type.Literal(3.14)
  const R = Value.Convert(T, '3.15')
  Assert.IsEqual(R, '3.15')
})
Test('LiteralNumber: Should convert 3', () => {
  const T = Type.Literal(1)
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, 1)
})
Test('LiteralNumber: Should convert 4', () => {
  const T = Type.Literal(0)
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, 0)
})
Test('LiteralNumber: Should convert 5', () => {
  const T = Type.Literal(2)
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, true)
})
// ------------------------------------------------------------------
// LiteralBoolean
// ------------------------------------------------------------------
Test('LiteralBoolean: Should convert 1', () => {
  const T = Type.Literal(true)
  const R = Value.Convert(T, 3.14)
  Assert.IsEqual(R, 3.14)
})
Test('LiteralBoolean: Should convert 2', () => {
  const T = Type.Literal(true)
  const R = Value.Convert(T, 1)
  Assert.IsEqual(R, true)
})
Test('LiteralBoolean: Should convert 3', () => {
  const T = Type.Literal(true)
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, true)
})
Test('LiteralBoolean: Should convert 4', () => {
  const T = Type.Literal(false)
  const R = Value.Convert(T, 'false')
  Assert.IsEqual(R, false)
})
Test('LiteralBoolean: Should convert 5', () => {
  const T = Type.Literal(true)
  const R = Value.Convert(T, '1')
  Assert.IsEqual(R, true)
})
Test('LiteralBoolean: Should convert 6', () => {
  const T = Type.Literal(false)
  const R = Value.Convert(T, '0')
  Assert.IsEqual(R, false)
})
Test('LiteralBoolean: Should convert 7', () => {
  const T = Type.Literal(false)
  const R = Value.Convert(T, '2')
  Assert.IsEqual(R, '2')
})
// ------------------------------------------------------------------
// LiteralBigInt
// ------------------------------------------------------------------
Test('LiteralBigInt: Should convert 1', () => {
  const T = Type.Literal(100n)
  const R = Value.Convert(T, 100n)
  Assert.IsEqual(R, 100n)
})
Test('LiteralBigInt: Should convert 2', () => {
  const T = Type.Literal(100n)
  const R = Value.Convert(T, 100)
  Assert.IsEqual(R, 100n)
})
Test('LiteralBigInt: Should convert 3', () => {
  const T = Type.Literal(1n)
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, 1n)
})
Test('LiteralBigInt: Should convert 4', () => {
  const T = Type.Literal(0n)
  const R = Value.Convert(T, 'false')
  Assert.IsEqual(R, 0n)
})
Test('LiteralBigInt: Should convert 5', () => {
  const T = Type.Literal(1n)
  const R = Value.Convert(T, '1')
  Assert.IsEqual(R, 1n)
})
Test('LiteralBigInt: Should convert 6', () => {
  const T = Type.Literal(0n)
  const R = Value.Convert(T, '0')
  Assert.IsEqual(R, 0n)
})
Test('LiteralBigInt: Should convert 7', () => {
  const T = Type.Literal(100n)
  const R = Value.Convert(T, '2')
  Assert.IsEqual(R, '2')
})
// ------------------------------------------------------------------
// LiteralBigInt
// ------------------------------------------------------------------
Test('LiteralBigInt: Should convert 1', () => {
  const T = Type.Literal(100n)
  const R = Value.Convert(T, 100n)
  Assert.IsEqual(R, 100n)
})
Test('LiteralBigInt: Should convert 2', () => {
  const T = Type.Literal(100n)
  const R = Value.Convert(T, 100)
  Assert.IsEqual(R, 100n)
})
Test('LiteralBigInt: Should convert 3', () => {
  const T = Type.Literal(1n)
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, 1n)
})
Test('LiteralBigInt: Should convert 4', () => {
  const T = Type.Literal(0n)
  const R = Value.Convert(T, 'false')
  Assert.IsEqual(R, 0n)
})
Test('LiteralBigInt: Should convert 5', () => {
  const T = Type.Literal(1n)
  const R = Value.Convert(T, '1')
  Assert.IsEqual(R, 1n)
})
Test('LiteralBigInt: Should convert 6', () => {
  const T = Type.Literal(0n)
  const R = Value.Convert(T, '0')
  Assert.IsEqual(R, 0n)
})
Test('LiteralBigInt: Should convert 7', () => {
  const T = Type.Literal(100n)
  const R = Value.Convert(T, '2')
  Assert.IsEqual(R, '2')
})
