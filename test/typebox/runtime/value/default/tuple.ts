import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Tuple')

Test('Should Default 1', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()], { default: 1 })
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 1)
})
Test('Should Default 2', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()], { default: 1 })
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Elements
// ----------------------------------------------------------------
Test('Should Default 3', () => {
  const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })], { default: [] })
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Default 4', () => {
  const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })], { default: [] })
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, [1, 2])
})
Test('Should Default 5', () => {
  const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })], { default: [] })
  const R = Value.Default(T, [4, 5, 6])
  Assert.IsEqual(R, [4, 5, 6])
})
Test('Should Default 6', () => {
  const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })])
  const R = Value.Default(T, [4, 5, 6])
  Assert.IsEqual(R, [4, 5, 6])
})
Test('Should Default 7', () => {
  const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })])
  const R = Value.Default(T, [4])
  Assert.IsEqual(R, [4, 2])
})
