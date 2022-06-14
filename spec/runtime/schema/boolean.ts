import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Boolean', () => {
  it('Should validate a boolean', () => {
    const T = Type.Boolean()
    ok(T, true)
    ok(T, false)
  })

  it('Should not validate a number', () => {
    const T = Type.Boolean()
    fail(T, 1)
  })

  it('Should not validate a string', () => {
    const T = Type.Boolean()
    fail(T, 'true')
  })

  it('Should not validate an array', () => {
    const T = Type.Boolean()
    fail(T, [true])
  })

  it('Should not validate an object', () => {
    const T = Type.Boolean()
    fail(T, {})
  })

  it('Should not validate an null', () => {
    const T = Type.Boolean()
    fail(T, null)
  })

  it('Should not validate an undefined', () => {
    const T = Type.Boolean()
    fail(T, undefined)
  })
})
