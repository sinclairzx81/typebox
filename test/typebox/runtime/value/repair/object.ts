import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Object')

const T = Type.Object({
  x: Type.Number({ default: 0 }),
  y: Type.Number({ default: 1 }),
  z: Type.Number({ default: 2 }),
  a: Type.String({ default: 'a' }),
  b: Type.String({ default: 'b' }),
  c: Type.String({ default: 'c' })
})
const E = {
  x: 0,
  y: 1,
  z: 2,
  a: 'a',
  b: 'b',
  c: 'c'
}
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
  const value = { x: 7, y: 8, z: 9, a: 10, b: 11, c: 12 }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, {
    x: 7,
    y: 8,
    z: 9,
    a: '10',
    b: '11',
    c: '12'
  })
})
Test('Should Repair 9', () => {
  const value = { x: 7, y: 8, z: 9 }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, {
    x: 7,
    y: 8,
    z: 9,
    a: 'a',
    b: 'b',
    c: 'c'
  })
})
Test('Should Repair 10', () => {
  const value = { x: {}, y: 8, z: 9 }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, {
    x: 0,
    y: 8,
    z: 9,
    a: 'a',
    b: 'b',
    c: 'c'
  })
})
Test('Should Repair 11', () => {
  const value = { x: 7, y: 8, z: 9, unknown: 'foo' }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, {
    x: 7,
    y: 8,
    z: 9,
    a: 'a',
    b: 'b',
    c: 'c'
  })
})
Test('Should Repair 12', () => {
  const result = Value.Repair(
    Type.Object(
      {
        x: Type.Number(),
        y: Type.Number()
      },
      {
        additionalProperties: Type.Object({
          a: Type.Number(),
          b: Type.Number()
        })
      }
    ),
    {
      x: 1,
      y: 2,
      z: true
    }
  )
  Assert.IsEqual(result, {
    x: 1,
    y: 2,
    z: { a: 0, b: 0 }
  })
})
Test('Should Repair 13', () => {
  const result = Value.Repair(
    Type.Object(
      {
        x: Type.Number(),
        y: Type.Number()
      },
      {
        additionalProperties: Type.Object({
          a: Type.Number(),
          b: Type.Number()
        })
      }
    ),
    {
      x: 1,
      y: 2,
      z: { b: 1 }
    }
  )
  Assert.IsEqual(result, {
    x: 1,
    y: 2,
    z: { a: 0, b: 1 }
  })
})
