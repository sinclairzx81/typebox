import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Boolean')

Test('Should Convert 1', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, '1')
  Assert.IsEqual(R, true)
})
Test('Should Convert 2', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, '3.14')
  Assert.IsEqual(R, '3.14')
})
Test('Should Convert 3', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, true)
})
Test('Should Convert 4', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, 'false')
  Assert.IsEqual(R, false)
})
Test('Should Convert 5', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, 1)
  Assert.IsEqual(R, true)
})
Test('Should Convert 6', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, 3.14)
  Assert.IsEqual(R, 3.14)
})
Test('Should Convert 7', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, 1.1)
  Assert.IsEqual(R, 1.1)
})
Test('Should Convert 8', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, true)
})
Test('Should Convert 9', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, false)
})
// ----------------------------------------------------------
// Casts
// ----------------------------------------------------------
Test('Should Convert 10', () => {
  const value = 'hello'
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, 'hello')
})
Test('Should Convert 11', () => {
  const value = 'true'
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 12', () => {
  const value = 'TRUE'
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 13', () => {
  const value = 'false'
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, false)
})
Test('Should Convert 14', () => {
  const value = '0'
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, false)
})
Test('Should Convert 15', () => {
  const value = '1'
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 16', () => {
  const value = '0'
  const result = Value.Convert(Type.Boolean({ default: true }), value)
  Assert.IsEqual(result, false)
})
Test('Should Convert 17', () => {
  const value = '1'
  const result = Value.Convert(Type.Boolean({ default: false }), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 18', () => {
  const value = '2'
  const result = Value.Convert(Type.Boolean({ default: true }), value)
  Assert.IsEqual(result, '2')
})
Test('Should Convert 19', () => {
  const value = 0
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, false)
})
Test('Should Convert 20', () => {
  const value = 1n
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 21', () => {
  const value = 1
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 22', () => {
  const value = 2
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, 2)
})
Test('Should Convert 23', () => {
  const value = 0
  const result = Value.Convert(Type.Boolean({ default: true }), value)
  Assert.IsEqual(result, false)
})
Test('Should Convert 24', () => {
  const value = 1
  const result = Value.Convert(Type.Boolean({ default: false }), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 25', () => {
  const value = 2
  const result = Value.Convert(Type.Boolean({ default: true }), value)
  Assert.IsEqual(result, 2)
})
Test('Should Convert 26', () => {
  const value = true
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, true)
})
Test('Should Convert 27', () => {
  const value = false
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, false)
})
Test('Should Convert 28', () => {
  const value = {}
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, {})
})
Test('Should Convert 29', () => {
  const value = [] as any[]
  const result = Value.Convert(Type.Boolean(), value)
  Assert.IsEqual(result, [])
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Convert 17', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, BigInt(0))
  Assert.IsEqual(R, false)
})
Test('Should Convert 18', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, BigInt(1))
  Assert.IsEqual(R, true)
})
Test('Should Convert 19', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, BigInt(2))
  Assert.IsEqual(R, BigInt(2))
})
Test('Should Convert 20', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, true)
})
Test('Should Convert 21', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, false)
})
Test('Should Convert 22', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, false)
})
Test('Should Convert 23', () => {
  const T = Type.Boolean()
  const R = Value.Convert(T, undefined)
  Assert.IsEqual(R, false)
})
