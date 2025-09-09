import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Intersect')

Test('Should intersect number and number', () => {
  const A = Type.Number()
  const B = Type.Number()
  const T = Type.Intersect([A, B], {})
  Ok(T, 1)
})
Test('Should not intersect string and number', () => {
  const A = Type.String()
  const B = Type.Number()
  const T = Type.Intersect([A, B], {})
  Fail(T, 1)
  Fail(T, '1')
})
Test('Should intersect two objects', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T = Type.Intersect([A, B], {})
  Ok(T, { x: 1, y: 1 })
})
Test('Should not intersect two objects with internal additionalProperties false', () => {
  const A = Type.Object({ x: Type.Number() }, { additionalProperties: false })
  const B = Type.Object({ y: Type.Number() }, { additionalProperties: false })
  const T = Type.Intersect([A, B], {})
  Fail(T, { x: 1, y: 1 })
})
Test('Should intersect two objects and mandate required properties', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T = Type.Intersect([A, B], {})
  Ok(T, { x: 1, y: 1 })
  Fail(T, { x: 1 })
  Fail(T, { y: 1 })
})
Test('Should intersect two objects with unevaluated properties', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T = Type.Intersect([A, B], {})
  Ok(T, { x: 1, y: 2, z: 1 })
})
Test('Should intersect two objects and restrict unevaluated properties', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T = Type.Intersect([A, B], { unevaluatedProperties: false })
  Fail(T, { x: 1, y: 2, z: 1 })
})
Test('Should intersect two objects and allow unevaluated properties of number', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T = Type.Intersect([A, B], { unevaluatedProperties: Type.Number() })
  Ok(T, { x: 1, y: 2, z: 3 })
  Fail(T, { x: 1, y: 2, z: '1' })
})
Test('Should intersect two nested objects and allow unevaluated properties of number', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T = Type.Object({ nested: Type.Intersect([A, B], { unevaluatedProperties: Type.Number() }) })
  Ok(T, { nested: { x: 1, y: 2, z: 3 } })
  Fail(T, { nested: { x: 1, y: 2, z: '1' } })
})
Test('Should intersect two union objects with overlapping properties of the same type', () => {
  const A = Type.Union([Type.Object({ x: Type.Number() })])
  const B = Type.Union([Type.Object({ x: Type.Number() })])
  const T = Type.Intersect([A, B])
  Ok(T, { x: 1 })
  Fail(T, { x: '1' })
})
Test('Should not intersect two union objects with overlapping properties of varying types', () => {
  const A = Type.Union([Type.Object({ x: Type.Number() })])
  const B = Type.Union([Type.Object({ x: Type.String() })])
  const T = Type.Intersect([A, B])
  Fail(T, { x: 1 })
  Fail(T, { x: '1' })
})
Test('Should intersect two union objects with non-overlapping properties', () => {
  const A = Type.Union([Type.Object({ x: Type.Number() })])
  const B = Type.Union([Type.Object({ y: Type.Number() })])
  const T = Type.Intersect([A, B])
  Ok(T, { x: 1, y: 1 })
})
Test('Should not intersect two union objects with non-overlapping properties for additionalProperties false', () => {
  const A = Type.Union([Type.Object({ x: Type.Number() }, { additionalProperties: false })])
  const B = Type.Union([Type.Object({ y: Type.Number() }, { additionalProperties: false })])
  const T = Type.Intersect([A, B])
  Fail(T, { x: 1, y: 1 })
})
Test('unevaluatedProperties with Record 1', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: false
    }
  )
  Ok(T, { x: 1, y: 2 })
})
Test('unevaluatedProperties with Record 2', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: false
    }
  )
  Ok(T, { x: 1, y: 2, 0: 'hello' })
})
Test('unevaluatedProperties with Record 3', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: false
    }
  )
  Fail(T, { x: 1, y: 2, 0: 1 })
})
Test('unevaluatedProperties with Record 4', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: Type.Boolean()
    }
  )
  Ok(T, { x: 1, y: 2 })
})
Test('unevaluatedProperties with Record 5', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: Type.Boolean()
    }
  )
  Ok(T, { x: 1, y: 2, z: true })
})
Test('unevaluatedProperties with Record 6', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: Type.Boolean()
    }
  )
  Fail(T, { x: 1, y: 2, z: 1 })
})
Test('unevaluatedProperties with Record 7', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: Type.Boolean()
    }
  )
  Ok(T, { x: 1, y: 2, 0: '' })
})
Test('unevaluatedProperties with Record 8', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: Type.Boolean()
    }
  )
  Ok(T, { x: 1, y: 2, 0: '', z: true })
})
Test('unevaluatedProperties with Record 9', () => {
  const T = Type.Intersect(
    [
      Type.Record(Type.Number(), Type.String()),
      Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    ],
    {
      unevaluatedProperties: Type.Boolean()
    }
  )
  Fail(T, { x: 1, y: 2, 0: '', z: 1 })
})
