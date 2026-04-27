import { Type } from 'typebox'
import { Fail, Ok } from './~validate.ts'
import { Assert } from 'test'
import { Check } from 'typebox/value'

const Test = Assert.Context('Value.Check.Refine')

Test('Should validate Refine 1', () => {
  const T = Type.Refine(Type.Any(), (value) => true)
  Ok(T, 1)
})
Test('Should validate Refine 2', () => {
  const T = Type.Refine(Type.Any(), (value) => false)
  Fail(T, 1)
})
Test('Should validate Refine 3', () => {
  const T = Type.Refine(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    (value) => value.x === value.y
  )
  Ok(T, { x: 1, y: 1 })
})
Test('Should validate Refine 4', () => {
  const T = Type.Refine(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    (value) => value.x === value.y
  )
  Fail(T, { x: 1, y: 2 })
})

Test('Should validate Refine 5', () => {
  const T = Type.Refine(
    Type.Refine(
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      }),
      (value) => value.x === value.y
    ),
    (value) => value.x === 1
  )
  Ok(T, { x: 1, y: 1 })
})
Test('Should validate Refine 6', () => {
  const T = Type.Refine(
    Type.Refine(
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      }),
      (value) => value.x === value.y
    ),
    (value) => value.x === 1
  )
  Fail(T, { x: 2, y: 2 })
})
// ------------------------------------------------------------------
// Refine Order
// ------------------------------------------------------------------
Test('Should validate Refine 7', () => {
  const buffer: number[] = []
  const T = Type.Refine(
    Type.Refine(
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      }),
      (value) => {
        buffer.push(0)
        return value.x === value.y
      }
    ),
    (value) => {
      buffer.push(1)
      return value.x === 1
    }
  )
  const R = Check(T, { x: 1, y: 1 })
  Assert.IsTrue(R)
  Assert.IsEqual(buffer, [0, 1])
})
Test('Should validate Refine 8', () => {
  const buffer: number[] = []
  const T = Type.Refine(
    Type.Refine(
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      }),
      (value) => {
        buffer.push(0)
        return value.x === value.y
      }
    ),
    (value) => {
      buffer.push(1)
      return value.x === 1
    }
  )
  const R = Check(T, { x: 1, y: 2 })
  Assert.IsFalse(R)
  Assert.IsEqual(buffer, [0])
})
// ------------------------------------------------------------------
// Unsafe/Refine
// ------------------------------------------------------------------
Test('Should validate Refine 8', () => {
  const T = Type.Unsafe<Date>(Type.Refine({}, (value) => value instanceof Date))
  const A = Check(T, new Date())
  const B = Check(T, {})
  Assert.IsTrue(A)
  Assert.IsFalse(B)
})
Test('Should validate Refine 9', () => {
  const T = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date)
  const A = Check(T, new Date())
  const B = Check(T, {})
  Assert.IsTrue(A)
  Assert.IsFalse(B)
})
