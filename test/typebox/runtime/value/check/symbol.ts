import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Symbol')

Test('Should not validate a boolean', () => {
  const T = Type.Symbol()
  Fail(T, true)
  Fail(T, false)
})
Test('Should not validate a number', () => {
  const T = Type.Symbol()
  Fail(T, 1)
})
Test('Should not validate a string', () => {
  const T = Type.Symbol()
  Fail(T, 'true')
})
Test('Should not validate an array', () => {
  const T = Type.Symbol()
  Fail(T, [true])
})
Test('Should not validate an object', () => {
  const T = Type.Symbol()
  Fail(T, {})
})
Test('Should not validate an null', () => {
  const T = Type.Symbol()
  Fail(T, null)
})
Test('Should not validate an undefined', () => {
  const T = Type.Symbol()
  Fail(T, undefined)
})
Test('Should not validate bigint', () => {
  const T = Type.Symbol()
  Fail(T, BigInt(1))
})
Test('Should not validate symbol', () => {
  const T = Type.Symbol()
  Ok(T, Symbol(1))
})
