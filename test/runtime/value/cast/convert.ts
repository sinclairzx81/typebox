import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

//---------------------------------------------------------------
// String Convert
//---------------------------------------------------------------
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
//---------------------------------------------------------------
// Number Convert
//---------------------------------------------------------------
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
//---------------------------------------------------------------
// Integer Convert
//---------------------------------------------------------------
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
//---------------------------------------------------------------
// Boolean Convert
//---------------------------------------------------------------
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

//---------------------------------------------------------------
// Date Convert
//---------------------------------------------------------------
describe('value/convert/Date', () => {
  it('Should convert from number', () => {
    const result = Value.Cast(Type.Date(), 123)
    Assert.deepEqual(result.getTime(), 123)
  })
  it('Should convert from numeric string', () => {
    const result = Value.Cast(Type.Date(), '123')
    Assert.deepEqual(result.getTime(), 123)
  })
  it('Should convert from boolean true (interpretted as numeric 1)', () => {
    const result = Value.Cast(Type.Date(), true)
    Assert.deepEqual(result.getTime(), 1)
  })
  it('Should convert from datetime string', () => {
    const result = Value.Cast(Type.Date(), '1980-02-03T01:02:03.000Z')
    Assert.deepEqual(result.toISOString(), '1980-02-03T01:02:03.000Z')
  })
  it('Should convert from datetime string without timezone', () => {
    const result = Value.Cast(Type.Date(), '1980-02-03T01:02:03')
    Assert.deepEqual(result.toISOString(), '1980-02-03T01:02:03.000Z')
  })
  it('Should convert from time with timezone', () => {
    const result = Value.Cast(Type.Date(), '01:02:03.000Z')
    Assert.deepEqual(result.toISOString(), '1970-01-01T01:02:03.000Z')
  })
  it('Should convert from time without timezone', () => {
    const result = Value.Cast(Type.Date(), '01:02:03')
    Assert.deepEqual(result.toISOString(), '1970-01-01T01:02:03.000Z')
  })
  it('Should convert from date string', () => {
    const result = Value.Cast(Type.Date(), '1980-02-03')
    Assert.deepEqual(result.toISOString(), '1980-02-03T00:00:00.000Z')
  })
  it('Should convert invalid strings to unix epoch 0', () => {
    const result = Value.Cast(Type.Date(), 'invalid-date')
    Assert.deepEqual(result.toISOString(), '1970-01-01T00:00:00.000Z')
  })
})
