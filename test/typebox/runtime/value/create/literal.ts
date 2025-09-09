import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Literal')

Test('Should Create 1', () => {
  const T = Type.Literal('hello')
  Assert.IsEqual(Value.Create(T), 'hello')
})
Test('Should Create 2', () => {
  const T = Type.Literal(1)
  Assert.IsEqual(Value.Create(T), 1)
})
Test('Should Create 3', () => {
  const T = Type.Literal(true)
  Assert.IsEqual(Value.Create(T), true)
})
Test('Should Create 4', () => {
  const T = Type.Literal(true, { default: 'hello' })
  Assert.IsEqual(Value.Create(T), 'hello')
})
