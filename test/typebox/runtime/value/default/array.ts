import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Array')

Test('Should Default 1', () => {
  const T = Type.Array(Type.Number(), { default: 1 })
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 1)
})
Test('Should Default 2', () => {
  const T = Type.Array(Type.Number(), { default: 1 })
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Elements
// ----------------------------------------------------------------
Test('Should Default 3', () => {
  const T = Type.Array(Type.Number({ default: 2 }))
  const R = Value.Default(T, [1, undefined, 3])
  Assert.IsEqual(R, [1, 2, 3])
})
// ----------------------------------------------------------------
// Elements
// ----------------------------------------------------------------
Test('Should Default 4', () => {
  const T = Type.Array(Type.Literal('hello', { default: 'hello' }))
  const R = Value.Default(T, [1, undefined, 3])
  Assert.IsEqual(R, [1, 'hello', 3])
})
// ----------------------------------------------------------------
// https://github.com/ubiquity-os-marketplace/command-start-stop/pull/86
// ----------------------------------------------------------------
Test('Should Default 5', () => {
  const U = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C'), Type.Literal('D')], { default: 'A' })
  const T = Type.Array(U, { default: ['A', 'B', 'C', 'D'], uniqueItems: true })
  Assert.IsEqual(Value.Default(T, undefined), ['A', 'B', 'C', 'D'])
  Assert.IsEqual(Value.Default(T, []), [])
  Assert.IsEqual(Value.Default(T, ['A']), ['A'])
  // initialize undefined element
  Assert.IsEqual(Value.Default(T, [undefined, 'B', 'C', 'D']), ['A', 'B', 'C', 'D'])
})
Test('Should Default 6', () => {
  const U = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C'), Type.Literal('D')], { default: 'A' })
  // undefined first element initialized by union default
  const T = Type.Array(U, { default: [undefined, 'B', 'C', 'D'], uniqueItems: true })
  Assert.IsEqual(Value.Default(T, undefined), ['A', 'B', 'C', 'D'])
})
