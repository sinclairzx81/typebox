import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/RegEx', () => {
  const T = Type.RegEx(/foo/, { default: 'foo' })
  const E = 'foo'

  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, 'foo')
  })

  it('Should upcast from number', () => {
    const value = 1
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from boolean', () => {
    const value = true
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from object', () => {
    const value = {}
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from array', () => {
    const value = [1]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from undefined', () => {
    const value = undefined
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from null', () => {
    const value = null
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should preserve', () => {
    const value = 'foo'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, value)
  })

  // ---------------------------------------------------
  // Conversion
  // ---------------------------------------------------

  it('Should convert bigint', () => {
    const T = Type.String()
    const result = Value.Cast(T, 1n)
    Assert.deepEqual(result, '1')
  })

  it('Should convert number', () => {
    const T = Type.String()
    const result = Value.Cast(T, 1)
    Assert.deepEqual(result, '1')
  })

  it('Should convert true', () => {
    const T = Type.String()
    const result = Value.Cast(T, true)
    Assert.deepEqual(result, 'true')
  })

  it('Should convert false', () => {
    const T = Type.String()
    const result = Value.Cast(T, false)
    Assert.deepEqual(result, 'false')
  })

  it('Should convert null', () => {
    const T = Type.String()
    const result = Value.Cast(T, null)
    Assert.deepEqual(result, '')
  })

  it('Should convert undefined', () => {
    const T = Type.String()
    const result = Value.Cast(T, undefined)
    Assert.deepEqual(result, '')
  })

  it('Should convert object', () => {
    const T = Type.String()
    const result = Value.Cast(T, {})
    Assert.deepEqual(result, '')
  })

  it('Should convert array', () => {
    const T = Type.String()
    const result = Value.Cast(T, [])
    Assert.deepEqual(result, '')
  })
})
