import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Integer')

Test('Should Create 1', () => {
  const T = Type.Integer()
  Assert.IsEqual(Value.Create(T), 0)
})
Test('Should Create 2', () => {
  const T = Type.Integer({ default: 7 })
  Assert.IsEqual(Value.Create(T), 7)
})
Test('Should Create 3', () => {
  const T = Type.Integer({ minimum: 10 })
  Assert.IsEqual(Value.Create(T), 10)
})

Test('Should Create 4', () => {
  const T = Type.Integer({ exclusiveMinimum: 10 })
  Assert.IsEqual(Value.Create(T), 11)
})
