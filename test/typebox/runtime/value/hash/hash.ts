import { Hash } from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Value.Hash')

Test('Should Hash 1', () => {
  const A = Hash(1)
  const B = Hash(1)
  Assert.IsEqual(A, B)
})

Test('Should Hash 2', () => {
  const A = Hash(1)
  const B = Hash(2)
  Assert.NotEqual(A, B)
})
