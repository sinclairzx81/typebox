import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Any')

Test('Should Convert 1', () => {
  const T = Type.Any()
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Convert 2', () => {
  const T = Type.Any()
  const R = Value.Convert(T, undefined)
  Assert.IsEqual(R, undefined)
})
Test('Should Convert 3', () => {
  const T = Type.Any()
  const R = Value.Convert(T, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Convert 4', () => {
  const T = Type.Any()
  const R = Value.Convert(T, 42)
  Assert.IsEqual(R, 42)
})
Test('Should Convert 5', () => {
  const T = Type.Any()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, true)
})
Test('Should Convert 6', () => {
  const T = Type.Any()
  const R = Value.Convert(T, { x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Convert 7', () => {
  const T = Type.Any()
  const R = Value.Convert(T, [1, 2, 3])
  Assert.IsEqual(R, [1, 2, 3])
})
Test('Should Convert 8', () => {
  const S = Symbol('x-symbol')
  const T = Type.Symbol()
  const R = Value.Convert(T, S)
  Assert.IsEqual(R, S)
})
