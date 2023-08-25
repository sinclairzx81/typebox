import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Integer', () => {
  it('Should not validate number', () => {
    const T = Type.Integer()
    Fail(T, 3.14)
  })
  it('Should validate integer', () => {
    const T = Type.Integer()
    Ok(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.Integer()
    Fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Integer()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Integer()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Integer()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.Integer()
    Fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Integer()
    Fail(T, undefined)
  })
  it('Should validate minimum', () => {
    const T = Type.Integer({ minimum: 10 })
    Fail(T, 9)
    Ok(T, 10)
  })
  it('Should validate maximum', () => {
    const T = Type.Integer({ maximum: 10 })
    Ok(T, 10)
    Fail(T, 11)
  })
  it('Should validate Date exclusiveMinimum', () => {
    const T = Type.Integer({ exclusiveMinimum: 10 })
    Fail(T, 10)
    Ok(T, 11)
  })
  it('Should validate Date exclusiveMaximum', () => {
    const T = Type.Integer({ exclusiveMaximum: 10 })
    Ok(T, 9)
    Fail(T, 10)
  })
  it('Should not validate NaN', () => {
    Fail(Type.Integer(), NaN)
  })
})
