import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Constructor')

Test('Should Convert 1', () => {
  // pass-through
  const V = class {}
  const T = Type.Constructor([], Type.Any())
  const R = Value.Convert(T, V)
  Assert.IsEqual(R, V)
})
Test('Should Convert 2', () => {
  // pass-through
  const T = Type.Constructor([], Type.Any())
  const R = Value.Convert(T, 1)
  Assert.IsEqual(R, 1)
})
