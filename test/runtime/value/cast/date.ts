import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Date', () => {
  const T = Type.Date()
  const E = new Date(0)
  it('Should upcast from string', () => {
    const value = 'world'
    const result = Value.Cast(T, value)
    Assert.InRange(result.getTime(), new Date().getTime(), 1000)
  })
  it('Should upcast from object', () => {
    const value = {}
    const result = Value.Cast(T, value)
    Assert.InRange(result.getTime(), new Date().getTime(), 1000)
  })
  it('Should upcast from array', () => {
    const value = [1]
    const result = Value.Cast(T, value)
    Assert.InRange(result.getTime(), new Date().getTime(), 1000)
  })
  it('Should upcast from undefined', () => {
    const value = undefined
    const result = Value.Cast(T, value)
    Assert.InRange(result.getTime(), new Date().getTime(), 1000)
  })
  it('Should upcast from null', () => {
    const value = null
    const result = Value.Cast(T, value)
    Assert.InRange(result.getTime(), new Date().getTime(), 1000)
  })
  it('Should preseve', () => {
    const value = new Date(100)
    const result = Value.Cast(T, value)
    Assert.IsEqual(result.getTime(), 100)
  })
})
