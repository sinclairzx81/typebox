import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Number', () => {
  it('Should validate number', () => {
    const T = Type.Number()
    ok(T, 3.14)
  })

  it('Should validate integer', () => {
    const T = Type.Number()
    ok(T, 1)
  })

  it('Should not validate string', () => {
    const T = Type.Number()
    fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Number()
    fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Number()
    fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Number()
    fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.Number()
    fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Number()
    fail(T, undefined)
  })

  it('Should validate minimum', () => {
    const T = Type.Number({ minimum: 10 })
    fail(T, 9)
    ok(T, 10)
  })

  it('Should validate maximum', () => {
    const T = Type.Number({ maximum: 10 })
    ok(T, 10)
    fail(T, 11)
  })

  it('Should validate Date exclusiveMinimum', () => {
    const T = Type.Number({ exclusiveMinimum: 10 })
    fail(T, 10)
    ok(T, 11)
  })

  it('Should validate Date exclusiveMaximum', () => {
    const T = Type.Number({ exclusiveMaximum: 10 })
    ok(T, 9)
    fail(T, 10)
  })

  it('Should not validate NaN', () => {
    fail(Type.Number(), NaN)
  })
})
