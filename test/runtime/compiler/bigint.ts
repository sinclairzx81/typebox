import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/BigInt', () => {
  it('Should not validate number', () => {
    const T = Type.BigInt()
    Fail(T, 3.14)
  })
  it('Should not validate NaN', () => {
    const T = Type.BigInt()
    Fail(T, NaN)
  })
  it('Should not validate +Infinity', () => {
    const T = Type.BigInt()
    Fail(T, Infinity)
  })
  it('Should not validate -Infinity', () => {
    const T = Type.BigInt()
    Fail(T, -Infinity)
  })
  it('Should not validate integer', () => {
    const T = Type.BigInt()
    Fail(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.BigInt()
    Fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.BigInt()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.BigInt()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.BigInt()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.BigInt()
    Fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.BigInt()
    Fail(T, undefined)
  })
  it('Should not validate symbol', () => {
    const T = Type.BigInt()
    Fail(T, Symbol())
  })
  it('Should validate bigint', () => {
    const T = Type.BigInt()
    Ok(T, BigInt(1))
  })
  it('Should validate minimum', () => {
    const T = Type.BigInt({ minimum: BigInt(10) })
    Fail(T, BigInt(9))
    Ok(T, BigInt(10))
  })

  it('Should validate maximum', () => {
    const T = Type.BigInt({ maximum: BigInt(10) })
    Ok(T, BigInt(10))
    Fail(T, BigInt(11))
  })

  it('Should validate Date exclusiveMinimum', () => {
    const T = Type.BigInt({ exclusiveMinimum: BigInt(10) })
    Fail(T, BigInt(10))
    Ok(T, BigInt(11))
  })

  it('Should validate Date exclusiveMaximum', () => {
    const T = Type.BigInt({ exclusiveMaximum: BigInt(10) })
    Ok(T, BigInt(9))
    Fail(T, BigInt(10))
  })

  it('Should not validate NaN', () => {
    Fail(Type.Number(), NaN)
  })
})
