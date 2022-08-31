import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Tuple', () => {
  const T = Type.Tuple([Type.Number(), Type.String()])
  const E = [0, '']

  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
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
    Assert.deepEqual(result, [1, ''])
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
    const value = [42, 'world']
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, value)
  })

  it('Should upcast with empty', () => {
    const value = [] as any[]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should append with less than tuple length', () => {
    const value = [42]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, [42, ''])
  })

  it('Should truncate with greater than tuple length', () => {
    const value = [42, '', true]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, [42, ''])
  })

  it('Should preserve and patch invalid element', () => {
    const value = [{}, 'hello']
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, [0, 'hello'])
  })
})
