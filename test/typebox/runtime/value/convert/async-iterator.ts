import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.AsyncIterator')

const T = Type.AsyncIterator(Type.Any())
Test('Should Convert 1', () => {
  const V = (async function* () {})()
  const R = Value.Convert(T, V)
  Assert.IsEqual(R, V)
})
Test('Should Convert 2', () => {
  const V = 1
  const R = Value.Convert(T, V)
  Assert.IsEqual(R, V)
})
