import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Boolean', () => {
  const T = Type.Boolean()
  const E = false

  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from number', () => {
    const value = 0
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from boolean', () => {
    const value = true
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, true)
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
    const value = true
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, true)
  })

  // ------------------------------------------------------
  // Conversion
  // ------------------------------------------------------

  it('Should convert string', () => {
    const T = Type.Boolean()
    {
      const result = Value.Cast(T, 'true')
      Assert.deepEqual(result, true)
    }
    {
      const result = Value.Cast(T, 'TRUE')
      Assert.deepEqual(result, true)
    }
    {
      const result = Value.Cast(T, 'True')
      Assert.deepEqual(result, true)
    }
    {
      const result = Value.Cast(T, 'Foo')
      Assert.deepEqual(result, false)
    }
  })

  it('Should convert number', () => {
    const T = Type.Boolean()
    {
      const result = Value.Cast(T, 1)
      Assert.deepEqual(result, true)
    }
    {
      const result = Value.Cast(T, 0)
      Assert.deepEqual(result, false)
    }
    {
      const result = Value.Cast(T, 2)
      Assert.deepEqual(result, false)
    }
  })

  it('Should convert boolean', () => {
    const T = Type.Boolean()
    {
      const result = Value.Cast(T, true)
      Assert.deepEqual(result, true)
    }
    {
      const result = Value.Cast(T, false)
      Assert.deepEqual(result, false)
    }
  })

  it('Should convert null', () => {
    const T = Type.Boolean()
    const result = Value.Cast(T, null)
    Assert.deepEqual(result, false)
  })

  it('Should convert undefined', () => {
    const T = Type.Boolean()
    const result = Value.Cast(T, null)
    Assert.deepEqual(result, false)
  })

  it('Should convert object', () => {
    const T = Type.Boolean()
    const result = Value.Cast(T, {})
    Assert.deepEqual(result, false)
  })

  it('Should convert array', () => {
    const T = Type.Boolean()
    const result = Value.Cast(T, [])
    Assert.deepEqual(result, false)
  })
})
