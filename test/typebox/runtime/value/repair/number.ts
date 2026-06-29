import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Number')

const T = Type.Number()
const E = 0
Test('Should Repair 1', () => {
  const value = 'world'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 2', () => {
  const value = 1
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, 1)
})
Test('Should Repair 3', () => {
  const value = {}
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 4', () => {
  const value = [1]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 5', () => {
  const value = undefined
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 6', () => {
  const value = null
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 7', () => {
  const value = 123
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, 123)
})
