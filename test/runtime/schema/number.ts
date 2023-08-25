import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Number', () => {
  it('Should validate number', () => {
    const T = Type.Number()
    Ok(T, 3.14)
  })
  it('Should validate integer', () => {
    const T = Type.Number()
    Ok(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.Number()
    Fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Number()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Number()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Number()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.Number()
    Fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Number()
    Fail(T, undefined)
  })
  it('Should validate minimum', () => {
    const T = Type.Number({ minimum: 10 })
    Fail(T, 9)
    Ok(T, 10)
  })
  it('Should validate maximum', () => {
    const T = Type.Number({ maximum: 10 })
    Ok(T, 10)
    Fail(T, 11)
  })
  it('Should validate Date exclusiveMinimum', () => {
    const T = Type.Number({ exclusiveMinimum: 10 })
    Fail(T, 10)
    Ok(T, 11)
  })
  it('Should validate Date exclusiveMaximum', () => {
    const T = Type.Number({ exclusiveMaximum: 10 })
    Ok(T, 9)
    Fail(T, 10)
  })
  it('Should not validate NaN', () => {
    Fail(Type.Number(), NaN)
  })
})
