import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Symbol', () => {
  const T = Type.Symbol()
  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should upcast from number', () => {
    const value = 0
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should upcast from boolean', () => {
    const value = true
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should upcast from object', () => {
    const value = {}
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should upcast from array', () => {
    const value = [1]
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should upcast from undefined', () => {
    const value = undefined
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should upcast from null', () => {
    const value = null
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should upcast from date', () => {
    const value = new Date(100)
    const result = Value.Cast(T, value)
    Assert.isTypeOf(result, 'symbol')
  })
  it('Should preserve', () => {
    const value = Symbol('hello')
    const result = Value.Cast(T, value)
    Assert.deepEqual(result.description, value.description)
  })
})
