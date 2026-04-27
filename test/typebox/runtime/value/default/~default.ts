import { Value } from 'typebox/value'
import { Assert } from 'test'
import Type from 'typebox'

const Test = Assert.Context('Value.Default.Default')

Test('Should Create 1', () => {
  const T = Type.Any({ default: 1 })
  Assert.IsEqual(Value.Default(T, undefined), 1)
})
Test('Should Create 2', () => {
  const T = Type.Any({ default: () => 1 })
  Assert.IsEqual(Value.Default(T, undefined), 1)
})
