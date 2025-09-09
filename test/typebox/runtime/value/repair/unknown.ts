import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Unknown')

const T = Type.Unknown()
Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 2', () => {
  const value = 1
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 3', () => {
  const value = false
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 4', () => {
  const value = {}
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 5', () => {
  const value = [1]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 6', () => {
  const value = undefined
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 7', () => {
  const value = null
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 8', () => {
  const value = { a: 1, b: 2 }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { a: 1, b: 2 })
})
