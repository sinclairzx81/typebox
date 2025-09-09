import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Null')

Test('Should not validate number', () => {
  const T = Type.Null()
  Fail(T, 1)
})
Test('Should not validate string', () => {
  const T = Type.Null()
  Fail(T, 'hello')
})
Test('Should not validate boolean', () => {
  const T = Type.Null()
  Fail(T, true)
})
Test('Should not validate array', () => {
  const T = Type.Null()
  Fail(T, [1, 2, 3])
})
Test('Should not validate object', () => {
  const T = Type.Null()
  Fail(T, { a: 1, b: 2 })
})
Test('Should not validate null', () => {
  const T = Type.Null()
  Ok(T, null)
})
Test('Should not validate undefined', () => {
  const T = Type.Null()
  Fail(T, undefined)
})
Test('Should not validate bigint', () => {
  const T = Type.Null()
  Fail(T, BigInt(1))
})
Test('Should not validate symbol', () => {
  const T = Type.Null()
  Fail(T, Symbol(1))
})
