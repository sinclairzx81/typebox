import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Array', () => {
  const T = Type.Array(Type.Number(), { default: [1, 2, 3] })
  const E = [1, 2, 3]

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
    Assert.deepEqual(result, [1])
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
    const value = [6, 7, 8]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, [6, 7, 8])
  })

  it('Should preserve with invalid element set to default', () => {
    const value = [6, 7, 8, 'hello', 9]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, [6, 7, 8, 0, 9])
  })

  // ----------------------------------------------------------
  // Constraints: Ranges
  // ----------------------------------------------------------

  it('Should cast array and truncate to maxItems from value', () => {
    const result = Value.Cast(Type.Array(Type.Number(), { maxItems: 3 }), [0, 1, 2, 4, 5, 6])
    Assert.deepEqual(result, [0, 1, 2])
  })

  it('Should cast arrays and append array to minItems from value', () => {
    const result = Value.Cast(Type.Array(Type.Number(), { minItems: 6 }), [0, 1, 2])
    Assert.deepEqual(result, [0, 1, 2, 0, 0, 0])
  })

  it('Should cast array and truncate to maxItems from default value', () => {
    const result = Value.Cast(Type.Array(Type.Number(), { maxItems: 3, default: [0, 1, 2, 4, 5, 6] }), null)
    Assert.deepEqual(result, [0, 1, 2])
  })

  it('Should cast arrays and append array to minItems from default value', () => {
    const result = Value.Cast(Type.Array(Type.Number({ default: 1 }), { minItems: 6, default: [0, 1, 2] }), null)
    Assert.deepEqual(result, [0, 1, 2, 1, 1, 1])
  })

  // ----------------------------------------------------------
  // Constraints: Unique
  // ----------------------------------------------------------
  
  it('Should cast arrays with uniqueItems with unique default value', () => {
    const result = Value.Cast(Type.Array(Type.Number(), { uniqueItems: true, default: [0, 1, 2] }), null)
    Assert.deepEqual(result, [0, 1, 2])
  })

  it('Should cast arrays with uniqueItems with unique value', () => {
    const result = Value.Cast(Type.Array(Type.Number(), { uniqueItems: true }), [0, 1, 2])
    Assert.deepEqual(result, [0, 1, 2])
  })

  it('Should throw when casting arrays with uniqueItems and no value or default value', () => {
    Assert.throws(() => Value.Cast(Type.Array(Type.Number(), { uniqueItems: true }), null))
  })
})
