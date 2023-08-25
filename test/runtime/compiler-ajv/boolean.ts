import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Boolean', () => {
  it('Should validate a boolean', () => {
    const T = Type.Boolean()
    Ok(T, true)
    Ok(T, false)
  })
  it('Should not validate a number', () => {
    const T = Type.Boolean()
    Fail(T, 1)
  })
  it('Should not validate a string', () => {
    const T = Type.Boolean()
    Fail(T, 'true')
  })
  it('Should not validate an array', () => {
    const T = Type.Boolean()
    Fail(T, [true])
  })
  it('Should not validate an object', () => {
    const T = Type.Boolean()
    Fail(T, {})
  })
  it('Should not validate an null', () => {
    const T = Type.Boolean()
    Fail(T, null)
  })
  it('Should not validate an undefined', () => {
    const T = Type.Boolean()
    Fail(T, undefined)
  })
})
