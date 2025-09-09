import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Array')

const T = Type.Array(Type.Number(), { default: [1, 2, 3] })
const E = [1, 2, 3]
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
  Assert.IsEqual(result, [1])
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
  const value = [6, 7, 8]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [6, 7, 8])
})
Test('Should Repair 9', () => {
  const value = [6, 7, 8, 'hello', 9]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [6, 7, 8, 0, 9])
})
// -----------------------------------------------------------------
// Constraints: Ranges
// -----------------------------------------------------------------
Test('Should Repair 10', () => {
  const result = Value.Repair(Type.Array(Type.Number(), { maxItems: 3 }), [0, 1, 2, 4, 5, 6])
  Assert.IsEqual(result, [0, 1, 2])
})
Test('Should Repair 11', () => {
  const result = Value.Repair(Type.Array(Type.Number(), { minItems: 6 }), [0, 1, 2])
  Assert.IsEqual(result, [0, 1, 2, 0, 0, 0])
})
Test('Should Repair 12', () => {
  const result = Value.Repair(Type.Array(Type.Number(), { maxItems: 3, default: [0, 1, 2, 4, 5, 6] }), null)
  Assert.IsEqual(result, [0, 1, 2])
})
Test('Should Repair 13', () => {
  const result = Value.Repair(Type.Array(Type.Number({ default: 1 }), { minItems: 6, default: [0, 1, 2] }), null)
  Assert.IsEqual(result, [0, 1, 2, 1, 1, 1])
})
// -----------------------------------------------------------------
// Constraints: Unique
// -----------------------------------------------------------------
Test('Should Repair 14', () => {
  const result = Value.Repair(Type.Array(Type.Number(), { uniqueItems: true, default: [0, 1, 2] }), null)
  Assert.IsEqual(result, [0, 1, 2])
})
Test('Should Repair 15', () => {
  const result = Value.Repair(Type.Array(Type.Number(), { uniqueItems: true }), [0, 1, 2])
  Assert.IsEqual(result, [0, 1, 2])
})
Test('Should Repair 16', () => {
  Assert.Throws(() => Value.Repair(Type.Array(Type.Number(), { uniqueItems: true }), null))
})
Test('Should Repair 17', () => {
  Assert.Throws(() => Value.Repair(Type.Array(Type.Number(), { minItems: 3, uniqueItems: true }), [0, 1]))
})
Test('Should Repair 18', () => {
  Assert.Throws(() => Value.Repair(Type.Array(Type.Number(), { minItems: 3, uniqueItems: true, default: [0, 1] }), null))
})
// -----------------------------------------------------------------
// Suggestion: https://github.com/sinclairzx81/typebox/issues/239
// -----------------------------------------------------------------
Test('Should Repair 19', () => {
  const T = Type.Array(Type.Number(), { uniqueItems: true })
  const value = [1, 1, 2, 2]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [1, 2])
})
Test('Should Repair 20', () => {
  const T = Type.Array(Type.Number(), { minItems: 3 })
  const value = [1, 2]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [1, 2, 0])
})
Test('Should Repair 21', () => {
  const T = Type.Array(Type.Number(), { maxItems: 3 })
  const value = [1, 2, 3, 4]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, [1, 2, 3])
})
