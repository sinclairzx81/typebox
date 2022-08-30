import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Integer', () => {
  const T = Type.Integer()
  const E = 0

  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from number', () => {
    const value = 1
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, 1)
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

  // ------------------------------------------------------
  // Conversion
  // ------------------------------------------------------

  it('Should convert string', () => {
    const T = Type.Integer()
    {
      const result = Value.Cast(T, '1')
      Assert.deepEqual(result, 1)
    }
    {
      const result = Value.Cast(T, '3.14')
      Assert.deepEqual(result, 3)
    }
    {
      const result = Value.Cast(T, 'Foo')
      Assert.deepEqual(result, 0)
    }
    {
      const result = Value.Cast(T, '-100')
      Assert.deepEqual(result, '-100')
    }
  })

  it('Should convert number', () => {
    const T = Type.Integer()
    {
      const result = Value.Cast(T, 0)
      Assert.deepEqual(result, 0)
    }
    {
      const result = Value.Cast(T, 1)
      Assert.deepEqual(result, 1)
    }
    {
      const result = Value.Cast(T, 2)
      Assert.deepEqual(result, 2)
    }
  })

  it('Should convert boolean', () => {
    const T = Type.Integer()
    {
      const result = Value.Cast(T, true)
      Assert.deepEqual(result, 0)
    }
    {
      const result = Value.Cast(T, false)
      Assert.deepEqual(result, 0)
    }
  })

  it('Should convert null', () => {
    const T = Type.Integer()
    const result = Value.Cast(T, null)
    Assert.deepEqual(result, 0)
  })

  it('Should convert undefined', () => {
    const T = Type.Integer()
    const result = Value.Cast(T, null)
    Assert.deepEqual(result, 0)
  })

  it('Should convert object', () => {
    const T = Type.Integer()
    const result = Value.Cast(T, {})
    Assert.deepEqual(result, 0)
  })

  it('Should convert array', () => {
    const T = Type.Integer()
    const result = Value.Cast(T, [])
    Assert.deepEqual(result, 0)
  })
})
