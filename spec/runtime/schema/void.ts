import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Void', () => {
  it('Should not validate number', () => {
    const T = Type.Void()
    fail(T, 1)
  })

  it('Should not validate string', () => {
    const T = Type.Void()
    fail(T, 'hello')
  })

  it('Should not validate boolean', () => {
    const T = Type.Void()
    fail(T, true)
  })

  it('Should not validate array', () => {
    const T = Type.Void()
    fail(T, [1, 2, 3])
  })

  it('Should not validate object', () => {
    const T = Type.Void()
    fail(T, { a: 1, b: 2 })
  })

  it('Should validate null', () => {
    const T = Type.Null()
    ok(T, null)
  })

  it('Should not validate undefined', () => {
    const T = Type.Void()
    fail(T, undefined)
  })
})
