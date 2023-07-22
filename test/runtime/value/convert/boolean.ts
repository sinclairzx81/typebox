import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Boolean', () => {
  it('Should convert from string 1', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, '1')
    Assert.IsEqual(R, true)
  })
  it('Should convert from string 2', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, '3.14')
    Assert.IsEqual(R, '3.14')
  })
  it('Should convert from string 3', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, 'true')
    Assert.IsEqual(R, true)
  })
  it('Should convert from string 4', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, 'false')
    Assert.IsEqual(R, false)
  })
  it('Should convert from number 1', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, 1)
    Assert.IsEqual(R, true)
  })
  it('Should convert from number 2', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, 3.14)
    Assert.IsEqual(R, 3.14)
  })
  it('Should convert from number 3', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, 1.1)
    Assert.IsEqual(R, 1.1)
  })
  it('Should convert from boolean 1', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, true)
  })
  it('Should convert from boolean 2', () => {
    const T = Type.Boolean()
    const R = Value.Convert(T, false)
    Assert.IsEqual(R, false)
  })
  // ----------------------------------------------------------
  // Casts
  // ----------------------------------------------------------
  it('Should convert string #1', () => {
    const value = 'hello'
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, 'hello')
  })
  it('Should convert string #2', () => {
    const value = 'true'
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert string #3', () => {
    const value = 'TRUE'
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert string #4', () => {
    const value = 'false'
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, false)
  })
  it('Should convert string #5', () => {
    const value = '0'
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, false)
  })
  it('Should convert string #6', () => {
    const value = '1'
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert string #7', () => {
    const value = '0'
    const result = Value.Convert(Type.Boolean({ default: true }), value)
    Assert.IsEqual(result, false)
  })
  it('Should convert string #8', () => {
    const value = '1'
    const result = Value.Convert(Type.Boolean({ default: false }), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert string #8', () => {
    const value = '2'
    const result = Value.Convert(Type.Boolean({ default: true }), value)
    Assert.IsEqual(result, '2')
  })
  it('Should convert number #1', () => {
    const value = 0
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, false)
  })
  it('Should convert number #2', () => {
    const value = 1n
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert number #3', () => {
    const value = 1
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert number #4', () => {
    const value = 2
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, 2)
  })
  it('Should convert number #5', () => {
    const value = 0
    const result = Value.Convert(Type.Boolean({ default: true }), value)
    Assert.IsEqual(result, false)
  })
  it('Should convert number #6', () => {
    const value = 1
    const result = Value.Convert(Type.Boolean({ default: false }), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert number #7', () => {
    const value = 2
    const result = Value.Convert(Type.Boolean({ default: true }), value)
    Assert.IsEqual(result, 2)
  })
  it('Should convert true', () => {
    const value = true
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, true)
  })
  it('Should convert false', () => {
    const value = false
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, false)
  })
  it('Should convert object', () => {
    const value = {}
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, {})
  })
  it('Should convert array', () => {
    const value = [] as any[]
    const result = Value.Convert(Type.Boolean(), value)
    Assert.IsEqual(result, [])
  })
})
