import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Boolean')

Test('Should Create 1', () => {
  const T = Type.Boolean()
  Assert.IsEqual(Value.Create(T), false)
})

Test('Should Create 2', () => {
  const T = Type.Boolean({ default: true })
  Assert.IsEqual(Value.Create(T), true)
})
