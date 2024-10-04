import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/BigInt', () => {
  it('Should convert bigint from string 1', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '1')
    Assert.IsEqual(R, BigInt(1))
  })
  it('Should convert bigint from string 2', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '3.14')
    Assert.IsEqual(R, BigInt(3))
  })
  it('Should convert bigint from string 3', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 'true')
    Assert.IsEqual(R, BigInt(1))
  })
  it('Should convert bigint from string 4', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 'false')
    Assert.IsEqual(R, BigInt(0))
  })
  it('Should convert bigint from string 5', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '12345678901234567890')
    Assert.IsEqual(R, BigInt('12345678901234567890'))
  })
  it('Should convert bigint from string 6', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '-12345678901234567890')
    Assert.IsEqual(R, BigInt('-12345678901234567890'))
  })
  it('Should convert bigint from string 7', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '12345678901234567890.123')
    Assert.IsEqual(R, BigInt('12345678901234567890'))
  })
  it('Should convert bigint from string 8', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '-12345678901234567890.123')
    Assert.IsEqual(R, BigInt('-12345678901234567890'))
  })
  it('Should convert bigint from number 1', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 1)
    Assert.IsEqual(R, BigInt(1))
  })
  it('Should convert bigint from number 2', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 3.14)
    Assert.IsEqual(R, BigInt(3))
  })
  it('Should convert bigint from number 3', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, Math.pow(2, 31))
    Assert.IsEqual(R, BigInt(2147483648))
  })
  it('Should convert bigint from number 4', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, Number.MAX_SAFE_INTEGER)
    Assert.IsEqual(R, BigInt(9007199254740991))
  })
  it('Should convert bigint from number 5', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 123456789012345.6789)
    Assert.IsEqual(R, BigInt(123456789012345))
  })
  it('Should convert bigint from number 6', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, -123456789012345.6789)
    Assert.IsEqual(R, BigInt(-123456789012345))
  })
  it('Should convert bigint from boolean 1', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, BigInt(1))
  })
  it('Should convert bigint from boolean 2', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, false)
    Assert.IsEqual(R, BigInt(0))
  })
})
