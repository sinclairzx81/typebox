import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Integer')

Test('Should not validate number', () => {
  const T = Type.Integer()
  Fail(T, 3.14)
})
Test('Should not validate NaN', () => {
  const T = Type.Integer()
  Fail(T, NaN)
})
Test('Should not validate +Infinity', () => {
  const T = Type.Integer()
  Fail(T, Infinity)
})
Test('Should not validate -Infinity', () => {
  const T = Type.Integer()
  Fail(T, -Infinity)
})
Test('Should validate integer', () => {
  const T = Type.Integer()
  Ok(T, 1)
})
Test('Should not validate string', () => {
  const T = Type.Integer()
  Fail(T, 'hello')
})
Test('Should not validate boolean', () => {
  const T = Type.Integer()
  Fail(T, true)
})
Test('Should not validate array', () => {
  const T = Type.Integer()
  Fail(T, [1, 2, 3])
})
Test('Should not validate object', () => {
  const T = Type.Integer()
  Fail(T, { a: 1, b: 2 })
})
Test('Should not validate null', () => {
  const T = Type.Integer()
  Fail(T, null)
})
Test('Should not validate undefined', () => {
  const T = Type.Integer()
  Fail(T, undefined)
})
Test('Should not validate bigint', () => {
  const T = Type.Integer()
  Fail(T, BigInt(1))
})
Test('Should not validate symbol', () => {
  const T = Type.Integer()
  Fail(T, Symbol(1))
})
Test('Should validate minimum', () => {
  const T = Type.Integer({ minimum: 10 })
  Fail(T, 9)
  Ok(T, 10)
})
Test('Should validate maximum', () => {
  const T = Type.Integer({ maximum: 10 })
  Ok(T, 10)
  Fail(T, 11)
})
Test('Should validate Date exclusiveMinimum', () => {
  const T = Type.Integer({ exclusiveMinimum: 10 })
  Fail(T, 10)
  Ok(T, 11)
})
Test('Should validate Date exclusiveMaximum', () => {
  const T = Type.Integer({ exclusiveMaximum: 10 })
  Ok(T, 9)
  Fail(T, 10)
})
