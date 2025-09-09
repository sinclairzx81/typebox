import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Enum')

enum Foo {
  A,
  B
}
const T = Type.Enum(Foo)
const E = Foo.A
Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 2', () => {
  const value = 123
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
  const value = Foo.A
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, Foo.A)
})
Test('Should Repair 9', () => {
  const value = Foo.B
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, Foo.B)
})
