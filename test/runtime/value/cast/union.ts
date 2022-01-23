import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Union', () => {
  const A = Type.Object(
    {
      type: Type.Literal('A'),
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    },
    { additionalProperties: false },
  )
  const B = Type.Object(
    {
      type: Type.Literal('B'),
      a: Type.String(),
      b: Type.String(),
      c: Type.String(),
    },
    { additionalProperties: false },
  )
  const T = Type.Union([A, B])

  const E = {
    type: 'A',
    x: 0,
    y: 0,
    z: 0,
  }

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

  it('Should preserve A', () => {
    const value = { type: 'A', x: 1, y: 2, z: 3 }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, value)
  })

  it('Should preserve B', () => {
    const value = { type: 'B', a: 'a', b: 'b', c: 'c' }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, value)
  })

  it('Should infer through heuristics #1', () => {
    const value = { type: 'A', a: 'a', b: 'b', c: 'c' }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, { type: 'A', x: 0, y: 0, z: 0 })
  })

  it('Should infer through heuristics #2', () => {
    const value = { type: 'B', x: 1, y: 2, z: 3 }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, { type: 'B', a: '', b: '', c: '' })
  })

  it('Should infer through heuristics #3', () => {
    const value = { type: 'A', a: 'a', b: 'b', c: null }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, { type: 'A', x: 0, y: 0, z: 0 })
  })

  it('Should infer through heuristics #4', () => {
    const value = { type: 'B', x: 1, y: 2, z: {} }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, { type: 'B', a: '', b: '', c: '' })
  })

  it('Should infer through heuristics #5', () => {
    const value = { type: 'B', x: 1, y: 2, z: null }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, { type: 'B', a: '', b: '', c: '' })
  })

  it('Should infer through heuristics #6', () => {
    const value = { x: 1 }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, { type: 'A', x: 1, y: 0, z: 0 })
  })

  it('Should infer through heuristics #7', () => {
    const value = { a: null } // property existing should contribute
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, { type: 'B', a: '', b: '', c: '' })
  })
})
