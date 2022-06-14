import { Type } from '@sinclair/typebox'
import { ok } from './validate'

describe('type/schema/Any', () => {
  it('Should validate number', () => {
    const T = Type.Any()
    ok(T, 1)
  })
  it('Should validate string', () => {
    const T = Type.Any()
    ok(T, 'hello')
  })
  it('Should validate boolean', () => {
    const T = Type.Any()
    ok(T, true)
  })
  it('Should validate array', () => {
    const T = Type.Any()
    ok(T, [1, 2, 3])
  })
  it('Should validate object', () => {
    const T = Type.Any()
    ok(T, { a: 1, b: 2 })
  })
  it('Should validate null', () => {
    const T = Type.Any()
    ok(T, null)
  })
  it('Should validate undefined', () => {
    const T = Type.Any()
    ok(T, undefined)
  })
})
