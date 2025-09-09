import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Union')

Test('Should Default 1', () => {
  const T = Type.Union([Type.Number(), Type.String()], { default: 1 })
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 1)
})
Test('Should Default 2', () => {
  const T = Type.Union([Type.Number(), Type.String()], { default: 1 })
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Interior
// ----------------------------------------------------------------
Test('Should Default 3', () => {
  const T = Type.Union([
    Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    }),
    Type.String({ default: 'hello' })
  ])
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Default 4', () => {
  const T = Type.Union([
    Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    }),
    Type.String({ default: 'hello' })
  ])
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 'hello')
})
Test('Should Default 5', () => {
  const T = Type.Union([
    Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    }),
    Type.String({ default: 'hello' })
  ])
  const R = Value.Default(T, 'world')
  Assert.IsEqual(R, 'world')
})
Test('Should Default 6', () => {
  const T = Type.Union([
    Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    }),
    Type.String({ default: 'hello' })
  ])
  const R = Value.Default(T, {})
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should Default 7', () => {
  const T = Type.Union([
    Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    }),
    Type.String({ default: 'hello' })
  ])
  const R = Value.Default(T, { x: 3 })
  Assert.IsEqual(R, { x: 3, y: 2 })
})
Test('Should Default 8', () => {
  const T = Type.Union([
    Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    }),
    Type.String({ default: 'hello' })
  ])
  const R = Value.Default(T, { x: 3, y: 4 })
  Assert.IsEqual(R, { x: 3, y: 4 })
})
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/993
// ----------------------------------------------------------------
Test('Should Default 9', () => {
  const T = Type.Union([
    Type.Tuple([Type.Number(), Type.Number()]),
    Type.Array(Type.Number())
  ])
  const value = ['hello']
  const R = Value.Default(T, value)
  Assert.IsTrue(R === value)
})
