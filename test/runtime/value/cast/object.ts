import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Object', () => {
  const T = Type.Object({
    a: Type.Number({ default: 'a' }),
    b: Type.Number({ default: 'b' }),
    c: Type.Number({ default: 'c' }),
    x: Type.Number({ default: 0 }),
    y: Type.Number({ default: 1 }),
    z: Type.Number({ default: 2 }),
  })
  const E = {
    x: 0,
    y: 1,
    z: 2,
    a: 'a',
    b: 'b',
    c: 'c',
  }
  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from number', () => {
    const value = E
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
    Assert.deepEqual(result, E)
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
  it('Should upcast from date', () => {
    const value = new Date(100)
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should preserve', () => {
    const value = { x: 7, y: 8, z: 9, a: 10, b: 11, c: 12 }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, {
      x: 7,
      y: 8,
      z: 9,
      a: 10,
      b: 11,
      c: 12,
    })
  })
  it('Should upcast and preserve partial object', () => {
    const value = { x: 7, y: 8, z: 9 }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, {
      x: 7,
      y: 8,
      z: 9,
      a: 'a',
      b: 'b',
      c: 'c',
    })
  })
  it('Should upcast and preserve partial object with incorrect properties', () => {
    const value = { x: {}, y: 8, z: 9 }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, {
      x: 0,
      y: 8,
      z: 9,
      a: 'a',
      b: 'b',
      c: 'c',
    })
  })
  it('Should upcast and preserve partial object and omit unknown properties', () => {
    const value = { x: 7, y: 8, z: 9, unknown: 'foo' }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, {
      x: 7,
      y: 8,
      z: 9,
      a: 'a',
      b: 'b',
      c: 'c',
    })
  })
  it('Should upcast and create invalid additional properties', () => {
    const result = Value.Cast(
      Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        {
          additionalProperties: Type.Object({
            a: Type.Number(),
            b: Type.Number(),
          }),
        },
      ),
      {
        x: 1,
        y: 2,
        z: true,
      },
    )
    Assert.deepEqual(result, {
      x: 1,
      y: 2,
      z: { a: 0, b: 0 },
    })
  })
  it('Should upcast and preserve additional properties', () => {
    const result = Value.Cast(
      Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        {
          additionalProperties: Type.Object({
            a: Type.Number(),
            b: Type.Number(),
          }),
        },
      ),
      {
        x: 1,
        y: 2,
        z: { b: 1 },
      },
    )
    Assert.deepEqual(result, {
      x: 1,
      y: 2,
      z: { a: 0, b: 1 },
    })
  })
})
