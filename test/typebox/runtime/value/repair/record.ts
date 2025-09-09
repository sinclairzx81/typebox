import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Record')

const T = Type.Record(
  Type.String(),
  Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
)
const E = {}
Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 2', () => {
  const value = E
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
  const value = {
    a: { x: 1, y: 2, z: 3 },
    b: { x: 4, y: 5, z: 6 }
  }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 9', () => {
  const value = {
    a: { x: 1, y: 2, z: 3 },
    b: { x: 4, y: 5, z: {} },
    c: [1, 2, 3],
    d: 1,
    e: { x: 1, y: 2, w: 9000 }
  }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, {
    a: { x: 1, y: 2, z: 3 },
    b: { x: 4, y: 5, z: 0 },
    c: { x: 0, y: 0, z: 0 },
    d: { x: 0, y: 0, z: 0 },
    e: { x: 1, y: 2, z: 0 }
  })
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Repair 10', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), {
    additionalProperties: Type.String()
  })
  const R = Value.Repair(T, { 0: 0, x: 1, y: 2 })
  Assert.IsEqual(R, { 0: 0, x: '1', y: '2' })
})
