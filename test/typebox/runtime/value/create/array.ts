import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Array')

Test('Should Create 1', () => {
  const T = Type.Array(Type.String())
  Assert.IsEqual(Value.Create(T), [])
})
Test('Should Create 2', () => {
  const T = Type.Array(Type.String(), { default: ['1'] })
  Assert.IsEqual(Value.Create(T), ['1'])
})
Test('Should Create 3', () => {
  const T = Type.Array(Type.String(), { minItems: 4 })
  Assert.IsEqual(Value.Create(T), ['', '', '', ''])
})
