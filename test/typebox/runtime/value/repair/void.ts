import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Void')

const E = undefined
Test('Should Repair 1', () => {
  const value = 'world'
  const T = Type.Void()
  const R = Value.Repair(T, value)
  Assert.IsEqual(R, E)
})
Test('Should Repair 2', () => {
  const value = 1
  const T = Type.Void()
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 3', () => {
  const value = true
  const T = Type.Void()
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 4', () => {
  const value = {}
  const T = Type.Void()
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 5', () => {
  const value = [1]
  const T = Type.Void()
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 6', () => {
  const value = undefined
  const T = Type.Void()
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 7', () => {
  const value = null
  const T = Type.Void()
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 8', () => {
  const value = undefined
  const T = Type.Void()
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, undefined)
})
