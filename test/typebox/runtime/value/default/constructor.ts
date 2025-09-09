import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Constructor')

Test('Should Default 1', () => {
  const T = Type.Constructor([], Type.Number(), { default: 1 })
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 1)
})

Test('Should Default 2', () => {
  const T = Type.Constructor([], Type.Number(), { default: 1 })
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
