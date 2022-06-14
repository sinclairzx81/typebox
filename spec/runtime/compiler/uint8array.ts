import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Uint8Array', () => {
  it('Should not validate number', () => {
    const T = Type.Uint8Array()
    fail(T, 1)
  })

  it('Should not validate string', () => {
    const T = Type.Uint8Array()
    fail(T, 'hello')
  })

  it('Should not validate boolean', () => {
    const T = Type.Uint8Array()
    fail(T, true)
  })

  it('Should not validate array', () => {
    const T = Type.Uint8Array()
    fail(T, [1, 2, 3])
  })

  it('Should not validate object', () => {
    const T = Type.Uint8Array()
    fail(T, { a: 1, b: 2 })
  })

  it('Should not validate null', () => {
    const T = Type.Uint8Array()
    fail(T, null)
  })

  it('Should not validate undefined', () => {
    const T = Type.Uint8Array()
    fail(T, undefined)
  })

  it('Should validate Uint8Array', () => {
    const T = Type.Uint8Array()
    ok(T, new Uint8Array(100))
  })

  it('Should validate Uint8Array with constraint', () => {
    const T = Type.Uint8Array({ minByteLength: 32, maxByteLength: 64 })
    ok(T, new Uint8Array(32))
    ok(T, new Uint8Array(64))
    fail(T, new Uint8Array(31))
    fail(T, new Uint8Array(65))
  })
})
