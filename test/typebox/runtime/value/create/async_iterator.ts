import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.AsyncIterator')

Test('Should Create 1', () => {
  const T = Type.AsyncIterator(Type.Any())
  const R = Value.Create(T)
  Assert.IsTrue(Symbol.asyncIterator in R)
})
Test('Should Create 2', () => {
  const T = Type.AsyncIterator(Type.Any(), { default: 1 })
  const R = Value.Create(T)
  Assert.IsEqual(R, 1)
})
