import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Tuple')

const T = Type.Tuple([Type.Number(), Type.String()])
const E = [0, '']
Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 2', () => {
  const value = 1
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 3', () => {
  const value = true
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 4', () => {
  const value = {}
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 5', () => {
  const value = [1]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [1, ''])
})
Test('Should Repair 6', () => {
  const value = undefined
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 7', () => {
  const value = null
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 8', () => {
  const value = [42, 'world']
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 9', () => {
  const value = [] as any[]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 10', () => {
  const value = [42]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [42, ''])
})
Test('Should Repair 11', () => {
  const value = [42, '', true]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [42, ''])
})
Test('Should Repair 12', () => {
  const value = [{}, 'hello']
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [0, 'hello'])
})
