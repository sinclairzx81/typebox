import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Any')

Test('Should Create 1', () => {
  const T = Type.Any()
  Assert.IsEqual(Value.Create(T), undefined)
})

Test('Should Create 2', () => {
  const T = Type.Any({ default: 1 })
  Assert.IsEqual(Value.Create(T), 1)
})
