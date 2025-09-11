import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Number')

Test('Should validate number', () => {
  const T = Type.Number()
  Ok(T, 3.14)
})
Test('Should not validate NaN', () => {
  const T = Type.Number()
  Fail(T, NaN)
})
Test('Should not validate +Infinity', () => {
  const T = Type.Number()
  Fail(T, Infinity)
})
Test('Should not validate -Infinity', () => {
  const T = Type.Number()
  Fail(T, -Infinity)
})
Test('Should validate integer', () => {
  const T = Type.Number()
  Ok(T, 1)
})
Test('Should not validate string', () => {
  const T = Type.Number()
  Fail(T, 'hello')
})
Test('Should not validate boolean', () => {
  const T = Type.Number()
  Fail(T, true)
})
Test('Should not validate array', () => {
  const T = Type.Number()
  Fail(T, [1, 2, 3])
})
Test('Should not validate object', () => {
  const T = Type.Number()
  Fail(T, { a: 1, b: 2 })
})
Test('Should not validate null', () => {
  const T = Type.Number()
  Fail(T, null)
})
Test('Should not validate undefined', () => {
  const T = Type.Number()
  Fail(T, undefined)
})
Test('Should not validate bigint', () => {
  const T = Type.Number()
  Fail(T, BigInt(1))
})
Test('Should not validate symbol', () => {
  const T = Type.Number()
  Fail(T, Symbol(1))
})
// ------------------------------------------------------------------
// Constraints: Number
// ------------------------------------------------------------------
Test('Should validate minimum', () => {
  const T = Type.Number({ minimum: 10 })
  Fail(T, 9)
  Ok(T, 10)
})
Test('Should validate maximum', () => {
  const T = Type.Number({ maximum: 10 })
  Ok(T, 10)
  Fail(T, 11)
})
Test('Should validate exclusiveMinimum', () => {
  const T = Type.Number({ exclusiveMinimum: 10 })
  Fail(T, 10)
  Ok(T, 11)
})
Test('Should validate exclusiveMaximum', () => {
  const T = Type.Number({ exclusiveMaximum: 10 })
  Ok(T, 9)
  Fail(T, 10)
})
Test('Should validate multipleOf', () => {
  const T = Type.Number({ multipleOf: 2 })
  Ok(T, 2)
  Fail(T, 1)
})
// ------------------------------------------------------------------
// Constraints: BigInt
// ------------------------------------------------------------------
Test('Should validate minimum (bigint)', () => {
  const T = Type.Number({ minimum: BigInt(10) })
  Fail(T, 9)
  Ok(T, 10)
})
Test('Should validate maximum (bigint)', () => {
  const T = Type.Number({ maximum: BigInt(10) })
  Ok(T, 10)
  Fail(T, 11)
})
Test('Should validate exclusiveMinimum (bigint)', () => {
  const T = Type.Number({ exclusiveMinimum: BigInt(10) })
  Fail(T, 10)
  Ok(T, 11)
})
Test('Should validate exclusiveMaximum (bigint)', () => {
  const T = Type.Number({ exclusiveMaximum: BigInt(10) })
  Ok(T, 9)
  Fail(T, 10)
})
Test('Should validate multipleOf (bigint)', () => {
  const T = Type.Number({ multipleOf: BigInt(2) })
  Ok(T, 2)
  Fail(T, 1)
})
