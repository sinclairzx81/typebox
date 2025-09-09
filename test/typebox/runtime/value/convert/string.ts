import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.String')

Test('Should Convert 1', () => {
  const T = Type.String()
  const R = Value.Convert(T, 3.14)
  Assert.IsEqual(R, '3.14')
})
Test('Should Convert 2', () => {
  const T = Type.String()
  const R = Value.Convert(T, 3)
  Assert.IsEqual(R, '3')
})
Test('Should Convert 3', () => {
  const T = Type.String()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, 'true')
})
Test('Should Convert 4', () => {
  const T = Type.String()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, 'false')
})
Test('Should Convert 5', () => {
  const T = Type.String()
  const R = Value.Convert(T, BigInt(12345))
  Assert.IsEqual(R, '12345')
})
// ----------------------------------------------------------
// Casts
// ----------------------------------------------------------
Test('Should Convert 6', () => {
  const T = Type.String()
  const R = Value.Convert(T, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Convert 7', () => {
  const T = Type.String()
  const R = Value.Convert(T, 42)
  Assert.IsEqual(R, '42')
})
Test('Should Convert 8', () => {
  const T = Type.String()
  const R = Value.Convert(T, 42n)
  Assert.IsEqual(R, '42')
})
Test('Should Convert 9', () => {
  const T = Type.String()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, 'true')
})
Test('Should Convert 10', () => {
  const T = Type.String()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, 'false')
})
Test('Should Convert 11', () => {
  const T = Type.String()
  const R = Value.Convert(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Convert 12', () => {
  const T = Type.String()
  const R = Value.Convert(T, [])
  Assert.IsEqual(R, [])
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Convert 13', () => {
  const T = Type.String()
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, 'null')
})
Test('Should Convert 14', () => {
  const T = Type.String()
  const R = Value.Convert(T, undefined)
  Assert.IsEqual(R, '')
})
