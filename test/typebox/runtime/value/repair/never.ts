import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Never')

const T = Type.Never()
Test('Should Repair 1', () => {
  const value = 'hello'
  Assert.Throws(() => Value.Repair(T, value))
})
Test('Should Repair 2', () => {
  const value = 1
  Assert.Throws(() => Value.Repair(T, value))
})
Test('Should Repair 3', () => {
  const value = false
  Assert.Throws(() => Value.Repair(T, value))
})
Test('Should Repair 4', () => {
  const value = {}
  Assert.Throws(() => Value.Repair(T, value))
})
Test('Should Repair 5', () => {
  const value = [1]
  Assert.Throws(() => Value.Repair(T, value))
})
Test('Should Repair 6', () => {
  const value = undefined
  Assert.Throws(() => Value.Repair(T, value))
})
Test('Should Repair 7', () => {
  const value = null
  Assert.Throws(() => Value.Repair(T, value))
})
Test('Should Repair 8', () => {
  const value = null
  Assert.Throws(() => Value.Repair(T, value))
})
