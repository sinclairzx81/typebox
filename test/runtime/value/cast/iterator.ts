import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Iterator', () => {
  const T = Type.Iterator(Type.Any())
  it('Should upcast from string', () => {
    const value = 'world'
    const result = Value.Cast(T, value)
    Assert.IsTrue(Symbol.iterator in result)
  })
  it('Should upcast from object', () => {
    const value = {}
    const result = Value.Cast(T, value)
    Assert.IsTrue(Symbol.iterator in result)
  })
  it('Should upcast from array', () => {
    const value = [1]
    const result = Value.Cast(T, value)
    Assert.IsTrue(Symbol.iterator in result)
  })
  it('Should upcast from undefined', () => {
    const value = undefined
    const result = Value.Cast(T, value)
    Assert.IsTrue(Symbol.iterator in result)
  })
  it('Should upcast from null', () => {
    const value = null
    const result = Value.Cast(T, value)
    Assert.IsTrue(Symbol.iterator in result)
  })
  it('Should preseve', () => {
    const value = (function* () {})()
    const result = Value.Cast(T, value)
    Assert.IsTrue(value === result)
  })
})
