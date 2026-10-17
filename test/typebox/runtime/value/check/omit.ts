import { Type } from 'typebox'
import { Fail, Ok } from './~validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Omit')

Test('Should omit properties on the source schema', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Omit(A, ['z'])
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
  const T = Type.Omit(A, ['z'])
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
  const T = Type.Omit(A, ['z'])
  Assert.HasPropertyKey(A, 'additionalProperties')
  Assert.IsEqual(A.additionalProperties, false)
  Assert.NotHasPropertyKey(T, 'additionalProperties')
})
Test('Should omit with keyof object', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const B = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  })
  const T = Type.Omit(A, Type.KeyOf(B), { additionalProperties: false })
  Ok(T, { z: 0 })
  Fail(T, { x: 0, y: 0, z: 0 })
})
Test('Should support Omit of Literal', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T = Type.Omit(A, Type.Literal('x'), {
    additionalProperties: false
  })
  Ok(T, { y: 1, z: 1 })
  Fail(T, { x: 1, y: 1, z: 1 })
})
Test('Should support Omit of Never', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Omit(A, Type.Never())
  Fail(T, { y: 1, z: 1 })
  Ok(T, { x: 1, y: 1, z: 1 })
})
// ------------------------------------------------------------------
// Retain Modifiers
//
// Ref: https://github.com/sinclairzx81/typebox/issues/1718
// ------------------------------------------------------------------
Test('Should retain optionality when omitting an intersection property', () => {
  const T = Type.Omit(
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
    Type.Literal('z')
  )
  Ok(T, {})
  Ok(T, { x: { a: 1, b: 1 } })
  Fail(T, { x: { a: 1 } })
  Fail(T, { x: { b: 1 } })
})
Test('Should retain required properties when omitting an unknown intersection property', () => {
  const T = Type.Omit(
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
    Type.Literal('c')
  )
  Ok(T, { z: 1 })
  Ok(T, { x: { a: 1, b: 1 }, z: 1 })
  Fail(T, {})
  Fail(T, { x: { a: 1 }, z: 1 })
})
Test('Should retain optionality when omitting never from an intersection', () => {
  const T = Type.Omit(
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
    Type.Never()
  )
  Ok(T, { z: 1 })
  Ok(T, { x: { a: 1, b: 1 }, z: 1 })
  Fail(T, { x: { a: 1 }, z: 1 })
})
Test('Should retain optionality when omitting a union property', () => {
  const T = Type.Omit(
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
    Type.Literal('z')
  )
  Ok(T, {})
  Ok(T, { x: 1 })
  Ok(T, { x: 'value' })
  Fail(T, { x: true })
})
Test('Should retain required properties when omitting an unknown union property', () => {
  const T = Type.Omit(
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
    Type.Literal('c')
  )
  Ok(T, { z: 1 })
  Ok(T, { x: 1, z: 1 })
  Ok(T, { x: 'value', z: 1 })
  Fail(T, {})
  Fail(T, { x: true, z: 1 })
})
Test('Should retain optionality when omitting never from a union', () => {
  const T = Type.Omit(
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
    Type.Never()
  )
  Ok(T, { z: 1 })
  Ok(T, { x: 1, z: 1 })
  Ok(T, { x: 'value', z: 1 })
  Fail(T, { x: true, z: 1 })
})
