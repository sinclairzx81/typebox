import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Symbol')

const T = Type.Symbol()
Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsTrue(typeof result === 'symbol')
})
Test('Should Repair 2', () => {
  const value = 0
  const result = Value.Repair(T, value)
  Assert.IsTrue(typeof result === 'symbol')
})
Test('Should Repair 3', () => {
  const value = true
  const result = Value.Repair(T, value)
  Assert.IsTrue(typeof result === 'symbol')
})
Test('Should Repair 4', () => {
  const value = {}
  const result = Value.Repair(T, value)
  Assert.IsTrue(typeof result === 'symbol')
})
Test('Should Repair 5', () => {
  const value = [1]
  const result = Value.Repair(T, value)
  Assert.IsTrue(typeof result === 'symbol')
})
Test('Should Repair 6', () => {
  const value = undefined
  const result = Value.Repair(T, value)
  Assert.IsTrue(typeof result === 'symbol')
})
Test('Should Repair 7', () => {
  const value = null
  const result = Value.Repair(T, value)
  Assert.IsTrue(typeof result === 'symbol')
})
Test('Should Repair 8', () => {
  const value = Symbol('hello')
  const result = Value.Repair(T, value)
  Assert.IsEqual(result.description, value.description)
})
