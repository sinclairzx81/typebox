import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Enum')

Test('Should Convert 1', () => {
  const T = Type.Object({
    x: Type.Enum([1, 2, 'hello'])
  })
  const R0 = Value.Convert(T, { x: '1' })
  const R1 = Value.Convert(T, { x: '2' })
  const R2 = Value.Convert(T, { x: 'hello' })
  const R3 = Value.Convert(T, { x: 'world' })
  Assert.IsEqual(R0, { x: 1 })
  Assert.IsEqual(R1, { x: 2 })
  Assert.IsEqual(R2, { x: 'hello' })
  Assert.IsEqual(R3, { x: 'world' })
})
