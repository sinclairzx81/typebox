import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Date', () => {
  it('Should not validate number', () => {
    const T = Type.Date()
    fail(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.Date()
    fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Date()
    fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Date()
    fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Date()
    fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.Date()
    fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Date()
    fail(T, undefined)
  })
  it('Should validate Date', () => {
    const T = Type.Date()
    ok(T, new Date())
  })
  it('Should validate Date minimumTimestamp', () => {
    const T = Type.Date({ minimumTimestamp: 10 })
    fail(T, new Date(9))
    ok(T, new Date(10))
  })
  it('Should validate Date maximumTimestamp', () => {
    const T = Type.Date({ maximumTimestamp: 10 })
    ok(T, new Date(10))
    fail(T, new Date(11))
  })
  it('Should validate Date exclusiveMinimumTimestamp', () => {
    const T = Type.Date({ exclusiveMinimumTimestamp: 10 })
    fail(T, new Date(10))
    ok(T, new Date(11))
  })
  it('Should validate Date exclusiveMaximumTimestamp', () => {
    const T = Type.Date({ exclusiveMaximumTimestamp: 10 })
    ok(T, new Date(9))
    fail(T, new Date(10))
  })
})
