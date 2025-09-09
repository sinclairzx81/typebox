import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Function')

Test('Should Create 1', () => {
  const T = Type.Function([], Type.Number({ default: 123 }))
  const F = Value.Create(T)
  const R = F()
  Assert.IsEqual(R, 123)
})
Test('Should Create 2', () => {
  const T = Type.Function([], Type.Number({ default: 123 }), { default: () => () => 321 })
  const F = Value.Create(T)
  const R = F()
  Assert.IsEqual(R, 321)
})
