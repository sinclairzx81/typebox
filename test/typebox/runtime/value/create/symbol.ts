import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Symbol')

Test('Should Create 1', () => {
  const T = Type.Symbol()
  const V = Value.Create(T)
  Assert.IsEqual(typeof V, 'symbol')
})

Test('Should Create 2', () => {
  const T = Type.Symbol({ default: true })
  Assert.IsEqual(Value.Create(T), true)
})
