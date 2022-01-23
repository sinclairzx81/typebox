import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/String', () => {
  it('Should convert string', () => {
    const value = 'hello'
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, 'hello')
  })

  it('Should convert number #1', () => {
    const value = 42
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, '42')
  })

  it('Should convert number #2', () => {
    const value = 42n
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, '42')
  })

  it('Should convert true', () => {
    const value = true
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, 'true')
  })

  it('Should convert false', () => {
    const value = false
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, 'false')
  })

  it('Should convert object', () => {
    const value = {}
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, '')
  })

  it('Should convert array', () => {
    const value = [] as any[]
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, '')
  })
})

describe('value/convert/Number', () => {
  it('Should convert string #1', () => {
    const value = 'hello'
    const result = Value.Cast(Type.Number(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert string #2', () => {
    const value = '3.14'
    const result = Value.Cast(Type.Number(), value)
    Assert.deepEqual(result, 3.14)
  })

  it('Should convert string #3', () => {
    const value = '-0'
    const result = Value.Cast(Type.Number(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert string #4', () => {
    const value = '-100'
    const result = Value.Cast(Type.Number(), value)
    Assert.deepEqual(result, -100)
  })

  it('Should convert number', () => {
    const value = 42
    const result = Value.Cast(Type.Number(), value)
    Assert.deepEqual(result, 42)
  })

  it('Should convert true', () => {
    const value = true
    const result = Value.Cast(Type.Number(), value)
    Assert.deepEqual(result, 1)
  })

  it('Should convert false', () => {
    const value = false
    const result = Value.Cast(Type.Number(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert object', () => {
    const value = {}
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert array', () => {
    const value = [] as any[]
    const result = Value.Cast(Type.String(), value)
    Assert.deepEqual(result, 0)
  })
})

describe('value/convert/Integer', () => {
  it('Should convert string #1', () => {
    const value = 'hello'
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert string #2', () => {
    const value = '3.14'
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 3)
  })

  it('Should convert string #3', () => {
    const value = '-0'
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert string #4', () => {
    const value = '-100'
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, -100)
  })

  it('Should convert number', () => {
    const value = 42
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 42)
  })

  it('Should convert true', () => {
    const value = true
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 1)
  })

  it('Should convert false', () => {
    const value = false
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert object', () => {
    const value = {}
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 0)
  })

  it('Should convert array', () => {
    const value = [] as any[]
    const result = Value.Cast(Type.Integer(), value)
    Assert.deepEqual(result, 0)
  })
})

describe('value/convert/Boolean', () => {
  it('Should convert string #1', () => {
    const value = 'hello'
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert string #2', () => {
    const value = 'true'
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert string #3', () => {
    const value = 'TRUE'
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert string #4', () => {
    const value = 'false'
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert string #5', () => {
    const value = '0'
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert string #6', () => {
    const value = '1'
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert string #7', () => {
    const value = '0'
    const result = Value.Cast(Type.Boolean({ default: true }), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert string #8', () => {
    const value = '1'
    const result = Value.Cast(Type.Boolean({ default: false }), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert string #8', () => {
    const value = '2'
    const result = Value.Cast(Type.Boolean({ default: true }), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert number #1', () => {
    const value = 0
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert number #2', () => {
    const value = 1n
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert number #3', () => {
    const value = 1
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert number #4', () => {
    const value = 2
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert number #5', () => {
    const value = 0
    const result = Value.Cast(Type.Boolean({ default: true }), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert number #6', () => {
    const value = 1
    const result = Value.Cast(Type.Boolean({ default: false }), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert number #7', () => {
    const value = 2
    const result = Value.Cast(Type.Boolean({ default: true }), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert true', () => {
    const value = true
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, true)
  })

  it('Should convert false', () => {
    const value = false
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert object', () => {
    const value = {}
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })

  it('Should convert array', () => {
    const value = [] as any[]
    const result = Value.Cast(Type.Boolean(), value)
    Assert.deepEqual(result, false)
  })
})
