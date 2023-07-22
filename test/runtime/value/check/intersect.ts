import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Intersect', () => {
  it('Should intersect number and number', () => {
    const A = Type.Number()
    const B = Type.Number()
    const T = Type.Intersect([A, B], {})
    Assert.IsEqual(Value.Check(T, 1), true)
  })
  it('Should not intersect string and number', () => {
    const A = Type.String()
    const B = Type.Number()
    const T = Type.Intersect([A, B], {})
    Assert.IsEqual(Value.Check(T, 1), false)
    Assert.IsEqual(Value.Check(T, '1'), false)
  })
  it('Should intersect two objects', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], {})
    Assert.IsEqual(Value.Check(T, { x: 1, y: 1 }), true)
  })
  it('Should not intersect two objects with internal additionalProperties false', () => {
    const A = Type.Object({ x: Type.Number() }, { additionalProperties: false })
    const B = Type.Object({ y: Type.Number() }, { additionalProperties: false })
    const T = Type.Intersect([A, B], {})
    Assert.IsEqual(Value.Check(T, { x: 1, y: 1 }), false)
  })
  it('Should intersect two objects and mandate required properties', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], {})
    Assert.IsEqual(Value.Check(T, { x: 1, y: 1 }), true)
    Assert.IsEqual(Value.Check(T, { x: 1 }), false)
    Assert.IsEqual(Value.Check(T, { x: 1 }), false)
  })
  it('Should intersect two objects with unevaluated properties', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], {})
    Assert.IsEqual(Value.Check(T, { x: 1, y: 1, z: 1 }), true)
  })
  it('Should intersect two objects and restrict unevaluated properties', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], { unevaluatedProperties: false })
    Assert.IsEqual(Value.Check(T, { x: 1, y: 1, z: 1 }), false)
  })
  it('Should intersect two objects and allow unevaluated properties of number', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], { unevaluatedProperties: Type.Number() })
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, z: 3 }), true)
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, z: '1' }), false)
  })
  it('Should intersect two union objects with overlapping properties of the same type', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() })])
    const B = Type.Union([Type.Object({ x: Type.Number() })])
    const T = Type.Intersect([A, B])
    Assert.IsEqual(Value.Check(T, { x: 1 }), true)
    Assert.IsEqual(Value.Check(T, { x: '1' }), false)
  })
  it('Should not intersect two union objects with overlapping properties of varying types', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() })])
    const B = Type.Union([Type.Object({ x: Type.String() })])
    const T = Type.Intersect([A, B])
    Assert.IsEqual(Value.Check(T, { x: 1 }), false)
    Assert.IsEqual(Value.Check(T, { x: '1' }), false)
  })
  it('Should intersect two union objects with non-overlapping properties', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() })])
    const B = Type.Union([Type.Object({ y: Type.Number() })])
    const T = Type.Intersect([A, B])
    Assert.IsEqual(Value.Check(T, { x: 1, y: 1 }), true)
  })
  it('Should not intersect two union objects with non-overlapping properties for additionalProperties false', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() }, { additionalProperties: false })])
    const B = Type.Union([Type.Object({ y: Type.Number() }, { additionalProperties: false })])
    const T = Type.Intersect([A, B])
    Assert.IsEqual(Value.Check(T, { x: 1, y: 1 }), false)
  })
  it('unevaluatedProperties with Record 1', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: false,
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2 }), true)
  })
  it('unevaluatedProperties with Record 2', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: false,
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, 0: 'hello' }), true)
  })
  it('unevaluatedProperties with Record 3', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: false,
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, 0: 1 }), false)
  })
  it('unevaluatedProperties with Record 4', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: Type.Boolean(),
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2 }), true)
  })
  it('unevaluatedProperties with Record 5', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: Type.Boolean(),
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, z: true }), true)
  })
  it('unevaluatedProperties with Record 6', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: Type.Boolean(),
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, z: 1 }), false)
  })
  it('unevaluatedProperties with Record 7', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: Type.Boolean(),
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, 0: '' }), true)
  })
  it('unevaluatedProperties with Record 8', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: Type.Boolean(),
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, 0: '', z: true }), true)
  })
  it('unevaluatedProperties with Record 9', () => {
    const T = Type.Intersect(
      [
        Type.Record(Type.Number(), Type.String()),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ],
      {
        unevaluatedProperties: Type.Boolean(),
      },
    )
    Assert.IsEqual(Value.Check(T, { x: 1, y: 2, 0: '', z: 1 }), false)
  })
})
