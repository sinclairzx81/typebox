import { Value } from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Default')

Test('Should Create 1', () => {
  const T = { default: 1 }
  Assert.IsEqual(Value.Create(T), 1)
})
Test('Should Create 2', () => {
  const T = { default: () => 1 }
  Assert.IsEqual(Value.Create(T), 1)
})
