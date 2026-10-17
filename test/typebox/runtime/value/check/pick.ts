import { Assert } from 'test'
import { Type } from 'typebox'
import { Fail, Ok } from './~validate.ts'

const Test = Assert.Context('Value.Check.Pick')

Test('Should pick properties from the source schema', () => {
  const Vector3 = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Pick(Vector3, ['x', 'y'])
  Ok(T, { x: 1, y: 1 })
})
Test('Should remove required properties on the target schema', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Pick(A, ['x', 'y'])
  Assert.IsEqual(T.required.includes('z' as never), false)
})
Test('Should not inherit options from the source object', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Pick(A, ['x', 'y'])
  Assert.HasPropertyKey(A, 'additionalProperties')
  Assert.IsEqual(A.additionalProperties, false)
  Assert.NotHasPropertyKey(T, 'additionalProperties')
})

Test('Should pick with keyof object', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const B = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  })
  const T = Type.Pick(A, Type.KeyOf(B), { additionalProperties: false })
  Ok(T, { x: 0, y: 0 })
  Fail(T, { x: 0, y: 0, z: 0 })
})
Test('Should support Pick of Literal', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T = Type.Pick(A, Type.Literal('x'), {
    additionalProperties: false
  })
  Ok(T, { x: 1 })
  Fail(T, { x: 1, y: 1, z: 1 })
})
Test('Should support Pick of Never', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T = Type.Pick(A, Type.Never(), {
    additionalProperties: false
  })
  Fail(T, { x: 1, y: 1, z: 1 })
  Ok(T, {})
})
// ------------------------------------------------------------------
// Retain Modifiers
//
// Ref: https://github.com/sinclairzx81/typebox/issues/1718
// ------------------------------------------------------------------
Test('Should retain optionality when picking an intersection property', () => {
  const T = Type.Pick(
    Type.Intersect([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ a: Type.Number() }))),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ b: Type.Number() }))),
        z: Type.Number()
      })
    ]),
    Type.Literal('x')
  )
  Ok(T, {})
  Ok(T, { x: { a: 1, b: 1 } })
  Fail(T, { x: { a: 1 } })
  Fail(T, { x: { b: 1 } })
})
Test('Should pick no properties for an unknown intersection key', () => {
  const T = Type.Pick(
    Type.Intersect([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ a: Type.Number() }))),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ b: Type.Number() }))),
        z: Type.Number()
      })
    ]),
    Type.Literal('c'),
    { additionalProperties: false }
  )
  Ok(T, {})
  Fail(T, { x: { a: 1, b: 1 } })
})
Test('Should pick no properties from an intersection with never', () => {
  const T = Type.Pick(
    Type.Intersect([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ a: Type.Number() }))),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ b: Type.Number() }))),
        z: Type.Number()
      })
    ]),
    Type.Never(),
    { additionalProperties: false }
  )
  Ok(T, {})
  Fail(T, { x: { a: 1, b: 1 } })
})
Test('Should retain optionality when picking a union property', () => {
  const T = Type.Pick(
    Type.Union([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Number())),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.String(),
        z: Type.Number()
      })
    ]),
    Type.Literal('x')
  )
  Ok(T, {})
  Ok(T, { x: 1 })
  Ok(T, { x: 'value' })
  Fail(T, { x: true })
})
Test('Should pick no properties for an unknown union key', () => {
  const T = Type.Pick(
    Type.Union([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Number())),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.String(),
        z: Type.Number()
      })
    ]),
    Type.Literal('c'),
    { additionalProperties: false }
  )
  Ok(T, {})
  Fail(T, { x: 1 })
})
Test('Should pick no properties from a union with never', () => {
  const T = Type.Pick(
    Type.Union([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Number())),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.String(),
        z: Type.Number()
      })
    ]),
    Type.Never(),
    { additionalProperties: false }
  )
  Ok(T, {})
  Fail(T, { x: 1 })
})
