import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Unknown')

Test('Should Convert 1', () => {
  const V = null
  const T = Type.Unknown()
  const R = Value.Convert(T, V)
  Assert.IsEqual(R, V)
})
Test('Should Convert 2', () => {
  const V = undefined
  const T = Type.Unknown()
  const R = Value.Convert(T, V)
  Assert.IsEqual(R, V)
})
Test('Should Convert 3', () => {
  const V = 'hello'
  const T = Type.Unknown()
  const R = Value.Convert(T, V)
  Assert.IsEqual(R, V)
})
Test('Should Convert 4', () => {
  const V = 42
  const T = Type.Unknown()
  const R = Value.Convert(T, V)
  Assert.IsEqual(R, V)
})
Test('Should Convert 5', () => {
  const T = Type.Unknown()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, true)
})
Test('Should Convert 6', () => {
  const T = Type.Unknown()
  const R = Value.Convert(T, { x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Convert 7', () => {
  const T = Type.Unknown()
  const R = Value.Convert(T, [1, 2, 3])
  Assert.IsEqual(R, [1, 2, 3])
})
