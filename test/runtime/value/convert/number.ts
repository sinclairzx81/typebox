import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Number', () => {
  const T = Type.Number()
  it('Should convert from string 1', () => {
    const R = Value.Convert(T, '3.14')
    Assert.IsEqual(R, 3.14)
  })
  it('Should convert from string 2', () => {
    const R = Value.Convert(T, '42')
    Assert.IsEqual(R, 42)
  })
  it('Should convert from boolean 1', () => {
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, 1)
  })
  it('Should convert from boolean 2', () => {
    const R = Value.Convert(T, false)
    Assert.IsEqual(R, 0)
  })
  it('Should convert from number 1', () => {
    const R = Value.Convert(T, 3.14)
    Assert.IsEqual(R, 3.14)
  })
  // ----------------------------------------------------------
  // Casts
  // ----------------------------------------------------------
  it('Should convert string #1', () => {
    const value = 'hello'
    const result = Value.Convert(Type.Number(), value)
    Assert.IsEqual(result, 'hello')
  })
  it('Should convert string #2', () => {
    const value = '3.14'
    const result = Value.Convert(Type.Number(), value)
    Assert.IsEqual(result, 3.14)
  })
  it('Should convert string #3', () => {
    const value = '-0'
    const result = Value.Convert(Type.Number(), value)
    Assert.IsEqual(result, -0)
  })
  it('Should convert string #4', () => {
    const value = '-100'
    const result = Value.Convert(Type.Number(), value)
    Assert.IsEqual(result, -100)
  })
  it('Should convert number', () => {
    const value = 42
    const result = Value.Convert(Type.Number(), value)
    Assert.IsEqual(result, 42)
  })
  it('Should convert true', () => {
    const value = true
    const result = Value.Convert(Type.Number(), value)
    Assert.IsEqual(result, 1)
  })
  it('Should convert false', () => {
    const value = false
    const result = Value.Convert(Type.Number(), value)
    Assert.IsEqual(result, 0)
  })
  it('Should convert object', () => {
    const value = {}
    const result = Value.Convert(Type.String(), value)
    Assert.IsEqual(result, {})
  })
  it('Should convert array', () => {
    const value = [] as any[]
    const result = Value.Convert(Type.String(), value)
    Assert.IsEqual(result, [])
  })
})
