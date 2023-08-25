import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Object', () => {
  it('Should not validate a number', () => {
    const T = Type.Object({})
    Fail(T, 42)
  })
  it('Should not validate a string', () => {
    const T = Type.Object({})
    Fail(T, 'hello')
  })
  it('Should not validate a boolean', () => {
    const T = Type.Object({})
    Fail(T, true)
  })
  it('Should not validate a null', () => {
    const T = Type.Object({})
    Fail(T, null)
  })
  it('Should not validate an array', () => {
    const T = Type.Object({})
    Fail(T, [1, 2])
  })
  it('Should validate with correct property values', () => {
    const T = Type.Object({
      a: Type.Number(),
      b: Type.String(),
      c: Type.Boolean(),
      d: Type.Array(Type.Number()),
      e: Type.Object({ x: Type.Number(), y: Type.Number() }),
    })
    Ok(T, {
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
    Fail(T, {
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
    Ok(T, {
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
    Ok(T, { a: 1 })
    Ok(T, { b: 'hello' })
    Fail(T, {})
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
    Ok(T, { a: 1 })
    Ok(T, { a: 1, b: 'hello' })
    Fail(T, {
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
    Fail(T, {
      a: 1,
      b: 'hello',
      c: true,
    })
  })

  it('Should not allow properties for an empty object when additionalProperties is false', () => {
    const T = Type.Object({}, { additionalProperties: false })
    Ok(T, {})
    Fail(T, { a: 10 })
  })

  it('Should validate with non-syntax property keys', () => {
    const T = Type.Object({
      'with-hyphen': Type.Literal(1),
      '0-leading': Type.Literal(2),
      '$-leading': Type.Literal(3),
      '!@#$%^&*(': Type.Literal(4),
    })
    Ok(T, {
      'with-hyphen': 1,
      '0-leading': 2,
      '$-leading': 3,
      '!@#$%^&*(': 4,
    })
  })

  it('Should validate schema additional properties of string', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
      },
      {
        additionalProperties: Type.String(),
      },
    )
    Ok(T, {
      x: 1,
      y: 2,
      z: 'hello',
    })
    Fail(T, {
      x: 1,
      y: 2,
      z: 3,
    })
  })

  it('Should validate schema additional properties of array', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
      },
      {
        additionalProperties: Type.Array(Type.Number()),
      },
    )
    Ok(T, {
      x: 1,
      y: 2,
      z: [0, 1, 2],
    })
    Fail(T, {
      x: 1,
      y: 2,
      z: 3,
    })
  })

  it('Should validate schema additional properties of object', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
      },
      {
        additionalProperties: Type.Object({
          z: Type.Number(),
        }),
      },
    )
    Ok(T, {
      x: 1,
      y: 2,
      z: { z: 1 },
    })
    Fail(T, {
      x: 1,
      y: 2,
      z: 3,
    })
  })
})
