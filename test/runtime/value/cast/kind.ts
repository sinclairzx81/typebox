import { Value } from '@sinclair/typebox/value'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Kind', () => {
  // ---------------------------------------------------------
  // Fixtures
  // ---------------------------------------------------------
  before(() => TypeRegistry.Set('Kind', (schema, value) => value === 'hello' || value === 'world'))
  after(() => TypeRegistry.Clear())
  // ---------------------------------------------------------
  // Tests
  // ---------------------------------------------------------
  const T = Type.Unsafe({ [Kind]: 'Kind', default: 'hello' })
  const E = 'hello'
  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from number', () => {
    const value = 1
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from boolean', () => {
    const value = false
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
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
  it('Should preserve', () => {
    const value = { a: 'hello', b: 'world' }
    const result = Value.Cast(
      Type.Object({
        a: T,
        b: T,
      }),
      value,
    )
    Assert.IsEqual(result, { a: 'hello', b: 'world' })
  })
})
