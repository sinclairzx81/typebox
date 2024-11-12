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
    Assert.IsEqual(result, E)
  })
  it('Should upcast from number', () => {
    const value = 1
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should upcast from boolean', () => {
    const value = true
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
  it('Should upcast from date', () => {
    const value = new Date(100)
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, E)
  })
  it('Should preserve A', () => {
    const value = { type: 'A', x: 1, y: 2, z: 3 }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, value)
  })
  it('Should preserve B', () => {
    const value = { type: 'B', a: 'a', b: 'b', c: 'c' }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, value)
  })
  it('Should infer through heuristics #1', () => {
    const value = { type: 'A', a: 'a', b: 'b', c: 'c' }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, { type: 'A', x: 0, y: 0, z: 0 })
  })
  it('Should infer through heuristics #2', () => {
    const value = { type: 'B', x: 1, y: 2, z: 3 }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, { type: 'B', a: '', b: '', c: '' })
  })
  it('Should infer through heuristics #3', () => {
    const value = { type: 'A', a: 'a', b: 'b', c: null }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, { type: 'A', x: 0, y: 0, z: 0 })
  })
  it('Should infer through heuristics #4', () => {
    const value = { type: 'B', x: 1, y: 2, z: {} }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, { type: 'B', a: '', b: '', c: '' })
  })
  it('Should infer through heuristics #5', () => {
    const value = { type: 'B', x: 1, y: 2, z: null }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, { type: 'B', a: '', b: '', c: '' })
  })
  it('Should infer through heuristics #6', () => {
    const value = { x: 1 }
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, { type: 'A', x: 1, y: 0, z: 0 })
  })
  it('Should infer through heuristics #7', () => {
    const value = { a: null } // property existing should contribute
    const result = Value.Cast(T, value)
    Assert.IsEqual(result, { type: 'B', a: '', b: '', c: '' })
  })
  it('Should cast with default value (create)', () => {
    const result = Value.Cast(
      Type.Object({
        id: Type.Number(),
        value: Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')], { default: 'C' }),
      }),
      {
        id: 42,
        value: 'D',
      },
    )
    Assert.IsEqual(result, {
      id: 42,
      value: 'C',
    })
  })
  it('Should cast with default value (preserve)', () => {
    const result = Value.Cast(
      Type.Object({
        id: Type.Number(),
        value: Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')], { default: 'C' }),
      }),
      {
        id: 42,
        value: 'B',
      },
    )
    Assert.IsEqual(result, {
      id: 42,
      value: 'B',
    })
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/880
  // ----------------------------------------------------------------
  // prettier-ignore
  it('Should dereference union variants', () => {
    const A = Type.Object({ type: Type.Literal('A') }, { $id: 'A' })
    const B = Type.Object({ type: Type.Literal('B'), value: Type.Number() }, { $id: 'B' })
    const RA = Type.Union([A, B])
    const RB = Type.Union([Type.Ref('A'), Type.Ref('B')])
    // variant 0
    Assert.IsEqual(Value.Cast(RA, [A, B], { type: 'B' }), { type: 'B', value: 0 })
    Assert.IsEqual(Value.Cast(RB, [A, B], { type: 'B' }), { type: 'B', value: 0 })
    // variant 1
    Assert.IsEqual(Value.Cast(RA, [A, B], { type: 'A' }), { type: 'A' })
    Assert.IsEqual(Value.Cast(RB, [A, B], { type: 'A' }), { type: 'A' })
  })
})
