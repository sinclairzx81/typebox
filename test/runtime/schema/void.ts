import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Void', () => {
  it('Should not validate number', () => {
    const T = Type.Void()
    Fail(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.Void()
    Fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Void()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Void()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Void()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should validate null', () => {
    const T = Type.Null()
    Ok(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Void()
    Fail(T, undefined)
  })
})
