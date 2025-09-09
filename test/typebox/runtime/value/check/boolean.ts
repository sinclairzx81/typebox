import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Boolean')

Test('Should validate a boolean', () => {
  const T = Type.Boolean()
  Ok(T, true)
  Ok(T, false)
})
Test('Should not validate a number', () => {
  const T = Type.Boolean()
  Fail(T, 1)
})
Test('Should not validate a string', () => {
  const T = Type.Boolean()
  Fail(T, 'true')
})
Test('Should not validate an array', () => {
  const T = Type.Boolean()
  Fail(T, [true])
})
Test('Should not validate an object', () => {
  const T = Type.Boolean()
  Fail(T, {})
})
Test('Should not validate an null', () => {
  const T = Type.Boolean()
  Fail(T, null)
})
Test('Should not validate an undefined', () => {
  const T = Type.Boolean()
  Fail(T, undefined)
})
Test('Should not validate bigint', () => {
  const T = Type.Boolean()
  Fail(T, BigInt(1))
})
Test('Should not validate symbol', () => {
  const T = Type.Boolean()
  Fail(T, Symbol(1))
})
