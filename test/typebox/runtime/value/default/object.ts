import { Memory } from 'typebox/system'
import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Object')

Test('Should Default 1', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    { default: 1 }
  )
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 1)
})
Test('Should Default 2', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    { default: 1 }
  )
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Construction
// ----------------------------------------------------------------
Test('Should Default 3', () => {
  const T = Type.Object(
    {
      x: Type.Object(
        {
          x: Type.Number({ default: 1 }),
          y: Type.Number({ default: 2 })
        },
        { default: {} }
      ),
      y: Type.Object(
        {
          x: Type.Number({ default: 3 }),
          y: Type.Number({ default: 4 })
        },
        { default: {} }
      )
    },
    { default: {} }
  )
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, { x: { x: 1, y: 2 }, y: { x: 3, y: 4 } })
})
Test('Should Default 4', () => {
  const T = Type.Object(
    {
      x: Type.Object(
        {
          x: Type.Number({ default: 1 }),
          y: Type.Number({ default: 2 })
        },
        { default: {} }
      ),
      y: Type.Object(
        {
          x: Type.Number({ default: 3 }),
          y: Type.Number({ default: 4 })
        },
        { default: {} }
      )
    },
    { default: {} }
  )
  const R = Value.Default(T, { x: null })
  Assert.IsEqual(R, { x: null, y: { x: 3, y: 4 } })
})
Test('Should Default 5', () => {
  const T = Type.Object(
    {
      x: Type.Object(
        {
          x: Type.Number({ default: 1 }),
          y: Type.Number({ default: 2 })
        },
        { default: {} }
      ),
      y: Type.Object(
        {
          x: Type.Number({ default: 3 }),
          y: Type.Number({ default: 4 })
        },
        { default: {} }
      )
    },
    { default: {} }
  )
  const R = Value.Default(T, { x: { x: null, y: null } })
  Assert.IsEqual(R, { x: { x: null, y: null }, y: { x: 3, y: 4 } })
})
// ----------------------------------------------------------------
// Properties
// ----------------------------------------------------------------
Test('Should Default 6', () => {
  const T = Type.Object(
    {
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    },
    { default: 1 }
  )
  const R = Value.Default(T, {})
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should Default 7', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  })
  const R = Value.Default(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Default 8', () => {
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number()
  })
  const R = Value.Default(T, {})
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Default 9', () => {
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number()
  })
  const R = Value.Default(T, { x: 3 })
  Assert.IsEqual(R, { x: 3 })
})
// ----------------------------------------------------------------
// AdditionalProperties
// ----------------------------------------------------------------
Test('Should Default 10', () => {
  const T = Type.Object(
    {
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    },
    {
      additionalProperties: Type.Number({ default: 3 })
    }
  )
  const R = Value.Default(T, {})
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should Default 11', () => {
  const T = Type.Object(
    {
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    },
    {
      additionalProperties: Type.Number({ default: 3 })
    }
  )
  const R = Value.Default(T, { x: null, y: null, z: undefined })
  Assert.IsEqual(R, { x: null, y: null, z: 3 })
})
Test('Should Default 12', () => {
  const T = Type.Object(
    {
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    },
    {
      additionalProperties: Type.Number()
    }
  )
  const R = Value.Default(T, { x: null, y: null, z: undefined })
  Assert.IsEqual(R, { x: null, y: null, z: undefined })
})
// ----------------------------------------------------------------
// Mutation
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/726
Test('Should Default 13', () => {
  const A = Type.Object({
    a: Type.Object(
      {
        b: Type.Array(Type.String(), { default: [] })
      },
      { default: {} }
    )
  })
  const value = Value.Default(A, {})
  Assert.IsEqual(value, { a: { b: [] } })
  // @ts-ignore
  Assert.IsEqual(A.properties.a.default, {})
  // @ts-ignore
  Assert.IsEqual(A.properties.a.properties.b.default, [])
})
// https://github.com/sinclairzx81/typebox/issues/726
Test('Should Default 14', () => {
  const A = Type.Object({
    a: Type.Object(
      {
        b: Type.Array(Type.String(), { default: [] })
      },
      { default: {} }
    )
  })
  const B = Memory.Clone(A)
  Value.Default(A, {})
  Assert.IsEqual(A, B)
})
// ----------------------------------------------------------------
// Traveral: https://github.com/sinclairzx81/typebox/issues/962
// ----------------------------------------------------------------
Test('Should Default 15', () => {
  const Y = Type.Object({ y: Type.String({ default: 'y' }) })
  const X = Type.Object({ x: Y })
  Assert.IsEqual(Value.Default(Y, {}), { y: 'y' })
  Assert.IsEqual(Value.Default(X, { x: {} }), { x: { y: 'y' } })
})
Test('Should Default 16', () => {
  const Y = Type.Object({ y: Type.String({ default: 'y' }) })
  const X = Type.Object({ x: Y })
  Assert.IsEqual(Value.Default(X, { x: { y: 1 } }), { x: { y: 1 } })
})
Test('Should Default 17', () => {
  const Y = Type.Object({ y: Type.String({ default: 'y' }) })
  const X = Type.Object({ x: Y })
  Assert.IsEqual(Value.Default(X, { x: undefined }), { x: undefined })
})
// ----------------------------------------------------------------
// Exterior Object Defaults
// ----------------------------------------------------------------
Test('Should Default 18', () => {
  const X = Type.Object({ x: Type.String({ default: 1 }) }, { default: {} })
  const R = Value.Default(X, undefined)
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Default 19', () => {
  const X = Type.Object({ x: Type.String({ default: 1 }) }, { default: {} })
  const R = Value.Default(X, {})
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Default 20', () => {
  const X = Type.Object({ x: Type.String({ default: 1 }) }, { default: {} })
  const R = Value.Default(X, { y: 3 })
  Assert.IsEqual(R, { y: 3, x: 1 })
})
Test('Should Default 21', () => {
  const X = Type.Object({ x: Type.String({ default: 1 }) }, { default: {} })
  const R = Value.Default(X, { y: 3, x: 7 })
  Assert.IsEqual(R, { y: 3, x: 7 })
})
Test('Should Default 22', () => {
  const X = Type.Object({ x: Type.String({ default: 1 }) }, { default: {} })
  const R = Value.Default(X, { x: 2 })
  Assert.IsEqual(R, { x: 2 })
})
Test('Should Default 23', () => {
  const X = Type.Object({ x: Type.Undefined({ default: undefined }) })
  const R = Value.Default(X, {})
  Assert.IsEqual(R, { x: undefined })
})
Test('Should Default 24', () => {
  const X = Type.Object({ x: Type.Optional({ default: undefined }) })
  const R = Value.Default(X, {})
  Assert.IsEqual(R, {})
})
