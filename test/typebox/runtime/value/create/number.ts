import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Number')

Test('Should Create 1', () => {
  const T = Type.Number()
  Assert.IsEqual(Value.Create(T), 0)
})

Test('Should Create 2', () => {
  const T = Type.Number({ default: 7 })
  Assert.IsEqual(Value.Create(T), 7)
})

Test('Should Create 3', () => {
  const T = Type.Number({ minimum: 10 })
  Assert.IsEqual(Value.Create(T), 10)
})

Test('Should Create 4', () => {
  const T = Type.Number({ exclusiveMinimum: 10 })
  Assert.IsEqual(Value.Create(T), 11)
})
