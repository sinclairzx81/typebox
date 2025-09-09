import { Type } from 'typebox'
import { Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Any')

Test('Should validate number', () => {
  const T = Type.Any()
  Ok(T, 1)
})
Test('Should validate string', () => {
  const T = Type.Any()
  Ok(T, 'hello')
})
Test('Should validate boolean', () => {
  const T = Type.Any()
  Ok(T, true)
})
Test('Should validate array', () => {
  const T = Type.Any()
  Ok(T, [1, 2, 3])
})
Test('Should validate object', () => {
  const T = Type.Any()
  Ok(T, { a: 1, b: 2 })
})
Test('Should validate null', () => {
  const T = Type.Any()
  Ok(T, null)
})
Test('Should validate undefined', () => {
  const T = Type.Any()
  Ok(T, undefined)
})
Test('Should validate bigint', () => {
  const T = Type.Any()
  Ok(T, BigInt(1))
})
Test('Should validate symbol', () => {
  const T = Type.Any()
  Ok(T, Symbol(1))
})
