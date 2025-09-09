import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Union')

// ----------------------------------------------------------------
// Clean
// ----------------------------------------------------------------
Test('Should Clean 1', () => {
  const T = Type.Union([Type.Number(), Type.Boolean()])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 2', () => {
  const T = Type.Union([Type.Number(), Type.Boolean()])
  const R = Value.Clean(T, 1)
  Assert.IsEqual(R, 1)
})
Test('Should Clean 2', () => {
  const T = Type.Union([Type.Number(), Type.Boolean()])
  const R = Value.Clean(T, true)
  Assert.IsEqual(R, true)
})
// ----------------------------------------------------------------
// Clean Select
// ----------------------------------------------------------------
Test('Should Clean 3', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 4', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 5', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { x: null })
  Assert.IsEqual(R, { x: null })
})
Test('Should Clean 6', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { y: null })
  Assert.IsEqual(R, { y: null })
})
// ----------------------------------------------------------------
// Clean Select Discard
// ----------------------------------------------------------------
Test('Should Clean 7', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 8', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null })
  Assert.IsEqual(R, { u: null }) // no match
})
Test('Should Clean 9', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null, x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clean 10', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null, y: 1 })
  Assert.IsEqual(R, { y: 1 })
})
// ----------------------------------------------------------------
// Clean Select Retain
// ----------------------------------------------------------------
Test('Should Clean 12', () => {
  const X = Type.Object({ x: Type.Number() }, { additionalProperties: Type.Null() })
  const Y = Type.Object({ y: Type.Number() }, { additionalProperties: Type.Null() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 13', () => {
  const X = Type.Object({ x: Type.Number() }, { additionalProperties: Type.Null() })
  const Y = Type.Object({ y: Type.Number() }, { additionalProperties: Type.Null() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null })
  Assert.IsEqual(R, { u: null })
})
Test('Should Clean 14', () => {
  const X = Type.Object({ x: Type.Number() }, { additionalProperties: Type.Null() })
  const Y = Type.Object({ y: Type.Number() }, { additionalProperties: Type.Null() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null, x: 1 })
  Assert.IsEqual(R, { u: null, x: 1 })
})
Test('Should Clean 15', () => {
  const X = Type.Object({ x: Type.Number() }, { additionalProperties: Type.Null() })
  const Y = Type.Object({ y: Type.Number() }, { additionalProperties: Type.Null() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null, y: 1 })
  Assert.IsEqual(R, { u: null, y: 1 })
})
// ----------------------------------------------------------------
// Clean Select First and Discard
// ----------------------------------------------------------------
Test('Should Clean 16', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() }, { additionalProperties: Type.Null() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null, x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clean 17', () => {
  const X = Type.Object({ x: Type.Number() })
  const Y = Type.Object({ y: Type.Number() }, { additionalProperties: Type.Null() })
  const T = Type.Union([X, Y])
  const R = Value.Clean(T, { u: null, y: 1 })
  Assert.IsEqual(R, { u: null, y: 1 })
})
