import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.KeyOf')

Test('Should validate literal number', () => {
  const T = Type.Literal(42)
  Ok(T, 42)
})
Test('Should validate literal string', () => {
  const T = Type.Literal('hello')
  Ok(T, 'hello')
})
Test('Should validate literal boolean', () => {
  const T = Type.Literal(true)
  Ok(T, true)
})
Test('Should not validate invalid literal number', () => {
  const T = Type.Literal(42)
  Fail(T, 43)
})
Test('Should not validate invalid literal string', () => {
  const T = Type.Literal('hello')
  Fail(T, 'world')
})
Test('Should not validate invalid literal boolean', () => {
  const T = Type.Literal(false)
  Fail(T, true)
})
Test('Should validate literal union', () => {
  const T = Type.Union([Type.Literal(42), Type.Literal('hello')])
  Ok(T, 42)
  Ok(T, 'hello')
})
Test('Should not validate invalid literal union', () => {
  const T = Type.Union([Type.Literal(42), Type.Literal('hello')])
  Fail(T, 43)
  Fail(T, 'world')
})
// reference: https://github.com/sinclairzx81/typebox/issues/539
Test('Should escape single quote literals', () => {
  const T = Type.Literal("it's")
  Ok(T, "it's")
  Fail(T, "it''s")
})
Test('Should escape multiple single quote literals', () => {
  const T = Type.Literal("'''''''''")
  Ok(T, "'''''''''")
  Fail(T, "''''''''") // minus 1
})
