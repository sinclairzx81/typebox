import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Recursive', () => {
  const T = Type.Recursive((Self) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Self),
    }),
  )

  const E = { id: '', nodes: [] }

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

  it('Should preserve', () => {
    const value = {
      id: 'A',
      nodes: [
        { id: 'B', nodes: [] },
        { id: 'C', nodes: [] },
        { id: 'D', nodes: [] },
      ],
    }
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, value)
  })

  it('Should upcast from varying types', () => {
    const TypeA = Type.Recursive((Self) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Self),
      }),
    )

    const TypeB = Type.Recursive((Self) =>
      Type.Object({
        id: Type.String(),
        name: Type.String({ default: 'test' }),
        nodes: Type.Array(Self),
      }),
    )

    const ValueA = {
      id: 'A',
      nodes: [
        { id: 'B', nodes: [] },
        { id: 'C', nodes: [] },
        { id: 'D', nodes: [] },
      ],
    }
    const ValueB = Value.Cast(TypeB, ValueA)

    Assert.deepEqual(ValueB, {
      id: 'A',
      name: 'test',
      nodes: [
        { id: 'B', name: 'test', nodes: [] },
        { id: 'C', name: 'test', nodes: [] },
        { id: 'D', name: 'test', nodes: [] },
      ],
    })
  })
})
