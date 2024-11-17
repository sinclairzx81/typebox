import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Array', () => {
  it('Should use default', () => {
    const T = Type.Array(Type.Number(), { default: 1 })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Array(Type.Number(), { default: 1 })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Elements
  // ----------------------------------------------------------------
  it('Should use default on elements', () => {
    const T = Type.Array(Type.Number({ default: 2 }))
    const R = Value.Default(T, [1, undefined, 3])
    Assert.IsEqual(R, [1, 2, 3])
  })
  // ----------------------------------------------------------------
  // Elements
  // ----------------------------------------------------------------
  it('Should should retain array and only initialize undefined elements', () => {
    const T = Type.Array(Type.Literal('hello', { default: 'hello' }))
    const R = Value.Default(T, [1, undefined, 3])
    Assert.IsEqual(R, [1, 'hello', 3])
  })
  // ----------------------------------------------------------------
  // https://github.com/ubiquity-os-marketplace/command-start-stop/pull/86
  // ----------------------------------------------------------------
  it('Should retain arrays 1', () => {
    const U = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C'), Type.Literal('D')], { default: 'A' })
    const T = Type.Array(U, { default: ['A', 'B', 'C', 'D'], uniqueItems: true })
    Assert.IsEqual(Value.Default(T, undefined), ['A', 'B', 'C', 'D'])
    Assert.IsEqual(Value.Default(T, []), [])
    Assert.IsEqual(Value.Default(T, ['A']), ['A'])
    // initialize undefined element
    Assert.IsEqual(Value.Default(T, [undefined, 'B', 'C', 'D']), ['A', 'B', 'C', 'D'])
  })
  it('Should retain arrays 2', () => {
    const U = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C'), Type.Literal('D')], { default: 'A' })
    // undefined first element initialized by union default
    const T = Type.Array(U, { default: [undefined, 'B', 'C', 'D'], uniqueItems: true })
    Assert.IsEqual(Value.Default(T, undefined), ['A', 'B', 'C', 'D'])
  })
})
