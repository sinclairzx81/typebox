import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.BigInt')

Test('Should not validate number', () => {
  const T = Type.BigInt()
  Fail(T, 3.14)
})
Test('Should not validate NaN', () => {
  const T = Type.BigInt()
  Fail(T, NaN)
})
Test('Should not validate +Infinity', () => {
  const T = Type.BigInt()
  Fail(T, Infinity)
})
Test('Should not validate -Infinity', () => {
  const T = Type.BigInt()
  Fail(T, -Infinity)
})
Test('Should not validate integer', () => {
  const T = Type.BigInt()
  Fail(T, 1)
})
Test('Should not validate string', () => {
  const T = Type.BigInt()
  Fail(T, 'hello')
})
Test('Should not validate boolean', () => {
  const T = Type.BigInt()
  Fail(T, true)
})
Test('Should not validate array', () => {
  const T = Type.BigInt()
  Fail(T, [1, 2, 3])
})
Test('Should not validate object', () => {
  const T = Type.BigInt()
  Fail(T, { a: 1, b: 2 })
})
Test('Should not validate null', () => {
  const T = Type.BigInt()
  Fail(T, null)
})
Test('Should not validate undefined', () => {
  const T = Type.BigInt()
  Fail(T, undefined)
})
Test('Should not validate symbol', () => {
  const T = Type.BigInt()
  Fail(T, Symbol())
})
Test('Should validate bigint', () => {
  const T = Type.BigInt()
  Ok(T, BigInt(1))
})
Test('Should not validate NaN', () => {
  Fail(Type.Number(), NaN)
})
// ------------------------------------------------------------------
// Constraints: BigInt
// ------------------------------------------------------------------
Test('Should validate minimum', () => {
  const T = Type.BigInt({ minimum: BigInt(10) })
  //Fail(T, BigInt(9))
  Ok(T, BigInt(10))
})
Test('Should validate maximum', () => {
  const T = Type.BigInt({ maximum: BigInt(10) })
  Ok(T, BigInt(10))
  Fail(T, BigInt(11))
})
Test('Should validate Date exclusiveMinimum', () => {
  const T = Type.BigInt({ exclusiveMinimum: BigInt(10) })
  Fail(T, BigInt(10))
  Ok(T, BigInt(11))
})
Test('Should validate Date exclusiveMaximum', () => {
  const T = Type.BigInt({ exclusiveMaximum: BigInt(10) })
  Ok(T, BigInt(9))
  Fail(T, BigInt(10))
})
// ------------------------------------------------------------------
// Constraints: Number
// ------------------------------------------------------------------
Test('Should validate minimum (bigint)', () => {
  const T = Type.BigInt({ minimum: 10 })
  Fail(T, BigInt(9))
  Ok(T, BigInt(10))
})
Test('Should validate maximum (bigint)', () => {
  const T = Type.BigInt({ maximum: 10 })
  Ok(T, BigInt(10))
  Fail(T, BigInt(11))
})
Test('Should validate exclusiveMinimum (bigint)', () => {
  const T = Type.BigInt({ exclusiveMinimum: 10 })
  Fail(T, BigInt(10))
  Ok(T, BigInt(11))
})
Test('Should validate exclusiveMaximum (bigint)', () => {
  const T = Type.BigInt({ exclusiveMaximum: 10 })
  Ok(T, BigInt(9))
  Fail(T, BigInt(10))
})
Test('Should validate multipleOf (bigint)', () => {
  const T = Type.BigInt({ multipleOf: 2 })
  Ok(T, BigInt(2))
  Fail(T, BigInt(1))
})
