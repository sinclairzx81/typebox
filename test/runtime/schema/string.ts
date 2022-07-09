import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/String', () => {
  it('Should not validate number', () => {
    const T = Type.String()
    fail(T, 1)
  })
  it('Should validate string', () => {
    const T = Type.String()
    ok(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.String()
    fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.String()
    fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.String()
    fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.String()
    fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.String()
    fail(T, undefined)
  })

  it('Should validate string format as email', () => {
    const T = Type.String({ format: 'email' })
    ok(T, 'name@domain.com')
  })

  it('Should validate string format as uuid', () => {
    const T = Type.String({ format: 'uuid' })
    ok(T, '4a7a17c9-2492-4a53-8e13-06ea2d3f3bbf')
  })

  it('Should validate string format as iso8601 date', () => {
    const T = Type.String({ format: 'date-time' })
    ok(T, '2021-06-11T20:30:00-04:00')
  })

  it('Should validate minLength', () => {
    const T = Type.String({ minLength: 4 })
    ok(T, '....')
    fail(T, '...')
  })

  it('Should validate maxLength', () => {
    const T = Type.String({ maxLength: 4 })
    ok(T, '....')
    fail(T, '.....')
  })

  it('Should pass numeric 5 digit test', () => {
    const T = Type.String({ pattern: '[\\d]{5}' })
    ok(T, '12345')
  })
})
