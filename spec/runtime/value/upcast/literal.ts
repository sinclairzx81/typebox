import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/upcast/Literal', () => {
  const T = Type.Literal('hello')
  const E = 'hello'

  it('Should upcast from string', () => {
    const value = 'world'
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from number', () => {
    const value = 1
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from boolean', () => {
    const value = true
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from object', () => {
    const value = {}
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from array', () => {
    const value = [1]
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from undefined', () => {
    const value = undefined
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from null', () => {
    const value = null
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should preseve', () => {
    const value = 'hello'
    const result = Value.Upcast(T, value)
    Assert.deepEqual(result, 'hello')
  })
})
