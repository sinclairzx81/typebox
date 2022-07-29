import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Object', () => {
  it('Should not validate a number', () => {
    const T = Type.Object({})
    fail(T, 42)
  })

  it('Should not validate a string', () => {
    const T = Type.Object({})
    fail(T, 'hello')
  })

  it('Should not validate a boolean', () => {
    const T = Type.Object({})
    fail(T, true)
  })

  it('Should not validate a null', () => {
    const T = Type.Object({})
    fail(T, null)
  })

  it('Should not validate an array', () => {
    const T = Type.Object({})
    fail(T, [1, 2])
  })

  it('Should validate with correct property values', () => {
    const T = Type.Object({
      a: Type.Number(),
      b: Type.String(),
      c: Type.Boolean(),
      d: Type.Array(Type.Number()),
      e: Type.Object({ x: Type.Number(), y: Type.Number() }),
    })
    ok(T, {
      a: 10,
      b: 'hello',
      c: true,
      d: [1, 2, 3],
      e: { x: 10, y: 20 },
    })
  })

  it('Should not validate with incorrect property values', () => {
    const T = Type.Object({
      a: Type.Number(),
      b: Type.String(),
      c: Type.Boolean(),
      d: Type.Array(Type.Number()),
      e: Type.Object({ x: Type.Number(), y: Type.Number() }),
    })
    fail(T, {
      a: 'not a number', // error
      b: 'hello',
      c: true,
      d: [1, 2, 3],
      e: { x: 10, y: 20 },
    })
  })

  it('Should allow additionalProperties by default', () => {
    const T = Type.Object({
      a: Type.Number(),
      b: Type.String(),
    })
    ok(T, {
      a: 1,
      b: 'hello',
      c: true,
    })
  })

  it('Should not allow an empty object if minProperties is set to 1', () => {
    const T = Type.Object(
      {
        a: Type.Optional(Type.Number()),
        b: Type.Optional(Type.String()),
      },
      { additionalProperties: false, minProperties: 1 },
    )
    ok(T, { a: 1 })
    ok(T, { b: 'hello' })
    fail(T, {})
  })

  it('Should not allow 3 properties if maxProperties is set to 2', () => {
    const T = Type.Object(
      {
        a: Type.Optional(Type.Number()),
        b: Type.Optional(Type.String()),
        c: Type.Optional(Type.Boolean()),
      },
      { additionalProperties: false, maxProperties: 2 },
    )
    ok(T, { a: 1 })
    ok(T, { a: 1, b: 'hello' })
    fail(T, {
      a: 1,
      b: 'hello',
      c: true,
    })
  })

  it('Should not allow additionalProperties if additionalProperties is false', () => {
    const T = Type.Object(
      {
        a: Type.Number(),
        b: Type.String(),
      },
      { additionalProperties: false },
    )
    fail(T, {
      a: 1,
      b: 'hello',
      c: true,
    })
  })

  it('Should not allow properties for an empty object when additionalProperties is false', () => {
    const T = Type.Object({}, { additionalProperties: false })
    ok(T, {})
    fail(T, { a: 10 })
  })

  it('Should validate with non-syntax property keys', () => {
    const T = Type.Object({
      'with-hyphen': Type.Literal(1),
      '0-leading': Type.Literal(2),
      '$-leading': Type.Literal(3),
      '!@#$%^&*(': Type.Literal(4),
    })
    ok(T, {
      'with-hyphen': 1,
      '0-leading': 2,
      '$-leading': 3,
      '!@#$%^&*(': 4,
    })
  })
})
