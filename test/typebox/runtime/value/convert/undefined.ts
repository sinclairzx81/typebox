import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Undefined')

Test('Should Convert 1', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, 'undefined')
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 2', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Convert 3', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 4', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, 0)
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 5', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 6', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, '')
  Assert.IsEqual(R, undefined)
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Convert 7', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, BigInt(0))
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 8', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, BigInt(1))
  Assert.IsEqual(R, BigInt(1))
})
Test('Should Convert 9', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, 0)
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 10', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, 1)
  Assert.IsEqual(R, 1)
})
Test('Should Convert 11', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 12', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, true)
})
Test('Should Convert 13', () => {
  const T = Type.Undefined()
  const R = Value.Convert(T, undefined)
  Assert.IsEqual(R, undefined)
})
