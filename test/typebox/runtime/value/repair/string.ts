import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.String')

const T = Type.String()
const E = ''
Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, 'hello')
})
Test('Should Repair 2', () => {
  const value = {}
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 3', () => {
  const value = [1]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 4', () => {
  const value = undefined
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 5', () => {
  const value = null
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, 'null')
})
Test('Should Repair 6', () => {
  const value = 'foo'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
