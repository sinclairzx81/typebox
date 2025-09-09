import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.BigInt')

Test('Should Create 1', () => {
  const T = Type.BigInt()
  Assert.IsEqual(Value.Create(T), BigInt(0))
})

Test('Should Create 2', () => {
  const T = Type.BigInt({ default: true })
  Assert.IsEqual(Value.Create(T), true)
})

Test('Should Create 3', () => {
  const T = Type.BigInt({ minimum: 10 })
  Assert.IsEqual(Value.Create(T), BigInt(10))
})

Test('Should Create 4', () => {
  const T = Type.BigInt({ exclusiveMinimum: 10 })
  Assert.IsEqual(Value.Create(T), BigInt(11))
})
