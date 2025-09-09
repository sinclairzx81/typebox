import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Unknown')

Test('Should Create 1', () => {
  const T = Type.Unknown()
  Assert.IsEqual(Value.Create(T), undefined)
})

Test('Should Create 2', () => {
  const T = Type.Unknown({ default: 1 })
  Assert.IsEqual(Value.Create(T), 1)
})
