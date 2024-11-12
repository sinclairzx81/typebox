import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Import', () => {
  const T = Type.Module({
    A: Type.Number(),
  }).Import('A')

  const E = 0
  it('Should upcast from string', () => {
    const value = 'world'
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from number', () => {
    const value = 1
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, 1)
  })
  it('Should upcast from object', () => {
    const value = {}
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from array', () => {
    const value = [1]
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from undefined', () => {
    const value = undefined
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from null', () => {
    const value = null
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from date', () => {
    const value = new Date(100)
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should preseve', () => {
    const value = 123
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, 123)
  })
})
