import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Boolean')

const T = Type.Boolean()
const E = false

Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 2', () => {
  const value = 0
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 3', () => {
  const value = true
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, true)
})
Test('Should Repair 4', () => {
  const value = {}
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 5', () => {
  const value = [1]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
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
  const value = true
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, true)
})
// ------------------------------------------------------------------
// CreateWhenUndefined
// ------------------------------------------------------------------
Test('Should Repair 9', () => {
  const result = Value.Repair(Type.Boolean({ default: true }), undefined)
  Assert.IsEqual(result, true)
})
Test('Should Repair 10', () => {
  const result = Value.Repair(Type.Boolean({ default: false }), undefined)
  Assert.IsEqual(result, false)
})
Test('Should Repair 11', () => {
  const result = Value.Repair(Type.Boolean({ default: 0 }), undefined)
  Assert.IsEqual(result, false)
})
Test('Should Repair 12', () => {
  const result = Value.Repair(Type.Boolean({ default: 1 }), undefined)
  Assert.IsEqual(result, true)
})
Test('Should Repair 13', () => {
  Assert.Throws(() => Value.Repair(Type.Boolean({ default: 2 }), undefined))
})
