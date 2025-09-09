import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.BigInt')

Test('Should Convert 1', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '1')
  Assert.IsEqual(R, BigInt(1))
})
Test('Should Convert 2', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '3.14')
  Assert.IsEqual(R, BigInt(3))
})
Test('Should Convert 3', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, BigInt(1))
})
Test('Should Convert 4', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 'false')
  Assert.IsEqual(R, BigInt(0))
})
Test('Should Convert 5', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '12345678901234567890')
  Assert.IsEqual(R, BigInt('12345678901234567890'))
})
Test('Should Convert 6', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '-12345678901234567890')
  Assert.IsEqual(R, BigInt('-12345678901234567890'))
})
Test('Should Convert 7', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '12345678901234567890.123')
  Assert.IsEqual(R, BigInt('12345678901234567890'))
})
Test('Should Convert 8', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '-12345678901234567890.123')
  Assert.IsEqual(R, BigInt('-12345678901234567890'))
})
Test('Should Convert 9', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 1)
  Assert.IsEqual(R, BigInt(1))
})
Test('Should Convert 10', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 3.14)
  Assert.IsEqual(R, BigInt(3))
})
Test('Should Convert 11', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, Math.pow(2, 31))
  Assert.IsEqual(R, BigInt(2147483648))
})
Test('Should Convert 12', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, Number.MAX_SAFE_INTEGER)
  Assert.IsEqual(R, BigInt(9007199254740991))
})
Test('Should Convert 13', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 123456789012345.6789)
  Assert.IsEqual(R, BigInt(123456789012345))
})
Test('Should Convert 14', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, -123456789012345.6789)
  Assert.IsEqual(R, BigInt(-123456789012345))
})
Test('Should Convert 15', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, BigInt(1))
})
Test('Should Convert 16', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, BigInt(0))
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Convert 17', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, BigInt(100))
  Assert.IsEqual(R, BigInt(100))
})
Test('Should Convert 18', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, BigInt(1))
})
Test('Should Convert 19', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, BigInt(0))
})
Test('Should Convert 20', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 12345)
  Assert.IsEqual(R, BigInt(12345))
})
Test('Should Convert 21', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, BigInt(0))
})
Test('Should Convert 22', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '123')
  Assert.IsEqual(R, BigInt(123))
})
Test('Should Convert 23', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '123.456')
  Assert.IsEqual(R, BigInt(123))
})
Test('Should Convert 24', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, '123n')
  Assert.IsEqual(R, BigInt(123))
})
Test('Should Convert 25', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, BigInt(1))
})
Test('Should Convert 26', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 'false')
  Assert.IsEqual(R, BigInt(0))
})
Test('Should Convert 27', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Convert 28', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, undefined)
  Assert.IsEqual(R, BigInt(0))
})
Test('Should Convert 29', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, 100)
  Assert.IsEqual(R, BigInt(100))
})
Test('Should Convert 30', () => {
  const T = Type.BigInt()
  const R = Value.Convert(T, BigInt(0))
  Assert.IsEqual(R, BigInt(0))
})
Test('Should Convert 31', () => {
  const T = Type.BigInt()
  const S = Symbol('hello')
  const R = Value.Convert(T, S)
  Assert.IsEqual(R, S)
})
