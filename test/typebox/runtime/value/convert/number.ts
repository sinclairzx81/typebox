import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Number')

Test('Should Convert 1', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '3.14')
  Assert.IsEqual(R, 3.14)
})
Test('Should Convert 2', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '42')
  Assert.IsEqual(R, 42)
})
Test('Should Convert 3', () => {
  const T = Type.Number()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, 1)
})
Test('Should Convert 4', () => {
  const T = Type.Number()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, 0)
})
Test('Should Convert 5', () => {
  const T = Type.Number()
  const R = Value.Convert(T, 3.14)
  Assert.IsEqual(R, 3.14)
})
// ----------------------------------------------------------
// Casts
// ----------------------------------------------------------
Test('Should Convert 6', () => {
  const T = Type.Number()
  const R = Value.Convert(T, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Convert 7', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '3.14')
  Assert.IsEqual(R, 3.14)
})
Test('Should Convert 8', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '-0')
  Assert.IsEqual(R, -0)
})
Test('Should Convert 9', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '-100')
  Assert.IsEqual(R, -100)
})
Test('Should Convert 10', () => {
  const T = Type.Number()
  const R = Value.Convert(T, 42)
  Assert.IsEqual(R, 42)
})
Test('Should Convert 11', () => {
  const T = Type.Number()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, 1)
})
Test('Should Convert 12', () => {
  const T = Type.Number()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, 0)
})
Test('Should Convert 13', () => {
  const T = Type.Number()
  const R = Value.Convert(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Convert 14', () => {
  const T = Type.Number()
  const R = Value.Convert(T, [])
  Assert.IsEqual(R, [])
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Convert 10', () => {
  const T = Type.Number()
  const R = Value.Convert(T, BigInt(0))
  Assert.IsEqual(R, 0)
})
Test('Should Convert 11', () => {
  const T = Type.Number()
  const R = Value.Convert(T, BigInt(10000000000000000000000000000000000000000000000000000))
  Assert.IsEqual(R, BigInt(10000000000000000000000000000000000000000000000000000))
})
Test('Should Convert 12', () => {
  const T = Type.Number()
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, 0)
})
Test('Should Convert 13', () => {
  const T = Type.Number()
  const R = Value.Convert(T, 'false')
  Assert.IsEqual(R, 0)
})
Test('Should Convert 14', () => {
  const T = Type.Number()
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, 1)
})
Test('Should Convert 15', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '123')
  Assert.IsEqual(R, 123)
})
Test('Should Convert 16', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '123.456')
  Assert.IsEqual(R, 123.456)
})
Test('Should Convert 17', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '123.456')
  Assert.IsEqual(R, 123.456)
})
Test('Should Convert 18', () => {
  const T = Type.Number()
  const R = Value.Convert(T, '123n')
  Assert.IsEqual(R, 123)
})
Test('Should Convert 19', () => {
  const T = Type.Number()
  const R = Value.Convert(T, undefined)
  Assert.IsEqual(R, 0)
})
