import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Literal', () => {
  it('Should validate literal number', () => {
    const T = Type.Literal(42)
    Ok(T, 42)
  })
  it('Should validate literal string', () => {
    const T = Type.Literal('hello')
    Ok(T, 'hello')
  })
  it('Should validate literal boolean', () => {
    const T = Type.Literal(true)
    Ok(T, true)
  })
  it('Should not validate invalid literal number', () => {
    const T = Type.Literal(42)
    Fail(T, 43)
  })
  it('Should not validate invalid literal string', () => {
    const T = Type.Literal('hello')
    Fail(T, 'world')
  })
  it('Should not validate invalid literal boolean', () => {
    const T = Type.Literal(false)
    Fail(T, true)
  })
  it('Should validate literal union', () => {
    const T = Type.Union([Type.Literal(42), Type.Literal('hello')])
    Ok(T, 42)
    Ok(T, 'hello')
  })
  it('Should not validate invalid literal union', () => {
    const T = Type.Union([Type.Literal(42), Type.Literal('hello')])
    Fail(T, 43)
    Fail(T, 'world')
  })
  // reference: https://github.com/sinclairzx81/typebox/issues/539
  it('Should escape single quote literals', () => {
    const T = Type.Literal("it's")
    Ok(T, "it's")
    Fail(T, "it''s")
  })
  it('Should escape multiple single quote literals', () => {
    const T = Type.Literal("'''''''''")
    Ok(T, "'''''''''")
    Fail(T, "''''''''") // minus 1
  })
})
