import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/String', () => {
  it('Should not validate number', () => {
    const T = Type.String()
    Fail(T, 1)
  })
  it('Should validate string', () => {
    const T = Type.String()
    Ok(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.String()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.String()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.String()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.String()
    Fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.String()
    Fail(T, undefined)
  })
  it('Should validate string format as email', () => {
    const T = Type.String({ format: 'email' })
    Ok(T, 'name@domain.com')
  })
  it('Should validate string format as uuid', () => {
    const T = Type.String({ format: 'uuid' })
    Ok(T, '4a7a17c9-2492-4a53-8e13-06ea2d3f3bbf')
  })
  it('Should validate string format as iso8601 date', () => {
    const T = Type.String({ format: 'date-time' })
    Ok(T, '2021-06-11T20:30:00-04:00')
  })
  it('Should validate minLength', () => {
    const T = Type.String({ minLength: 4 })
    Ok(T, '....')
    Fail(T, '...')
  })
  it('Should validate maxLength', () => {
    const T = Type.String({ maxLength: 4 })
    Ok(T, '....')
    Fail(T, '.....')
  })
  it('Should pass numeric 5 digit test', () => {
    const T = Type.String({ pattern: '[\\d]{5}' })
    Ok(T, '12345')
  })
})
