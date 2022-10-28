import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Integer', () => {
  it('Should not validate number', () => {
    const T = Type.Integer()
    fail(T, 3.14)
  })

  it('Should validate integer', () => {
    const T = Type.Integer()
    ok(T, 1)
  })

  it('Should not validate string', () => {
    const T = Type.Integer()
    fail(T, 'hello')
  })

  it('Should not validate boolean', () => {
    const T = Type.Integer()
    fail(T, true)
  })

  it('Should not validate array', () => {
    const T = Type.Integer()
    fail(T, [1, 2, 3])
  })

  it('Should not validate object', () => {
    const T = Type.Integer()
    fail(T, { a: 1, b: 2 })
  })

  it('Should not validate null', () => {
    const T = Type.Integer()
    fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Integer()
    fail(T, undefined)
  })

  it('Should validate minimum', () => {
    const T = Type.Integer({ minimum: 10 })
    fail(T, 9)
    ok(T, 10)
  })

  it('Should validate maximum', () => {
    const T = Type.Integer({ maximum: 10 })
    ok(T, 10)
    fail(T, 11)
  })

  it('Should validate Date exclusiveMinimum', () => {
    const T = Type.Integer({ exclusiveMinimum: 10 })
    fail(T, 10)
    ok(T, 11)
  })

  it('Should validate Date exclusiveMaximum', () => {
    const T = Type.Integer({ exclusiveMaximum: 10 })
    ok(T, 9)
    fail(T, 10)
  })
})
