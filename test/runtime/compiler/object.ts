import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/Object', () => {
  // -----------------------------------------------------
  // TypeCompiler Only
  // -----------------------------------------------------
  it('Should handle extends undefined check 1', () => {
    const T = Type.Object({
      A: Type.Not(Type.Number()),
      B: Type.Union([Type.Number(), Type.Undefined()]),
      C: Type.Intersect([Type.Undefined(), Type.Undefined()]),
    })
    Ok(T, {
      A: undefined,
      B: undefined,
      C: undefined,
    })
  })
  // https://github.com/sinclairzx81/typebox/issues/437
  it('Should handle extends undefined check 2', () => {
    const T = Type.Object({
      A: Type.Not(Type.Null()),
    })
    Ok(T, { A: undefined })
    Fail(T, { A: null })
    Fail(T, {})
  })
  // -----------------------------------------------------
  // Standard Checks
  // -----------------------------------------------------
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
  it('Should not validate undefined', () => {
    const T = Type.Object({})
    Fail(T, undefined)
  })
  it('Should not validate bigint', () => {
    const T = Type.Object({})
    Fail(T, BigInt(1))
  })
  it('Should not validate symbol', () => {
    const T = Type.Object({})
    Fail(T, Symbol(1))
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
      'node-mirror:release:0': Type.Literal(5), // issue: 353
      'node-mirror:release:1': Type.Optional(Type.Literal(6)), // issue: 356
      'node-mirror:release:2': Type.Union([Type.Literal(7), Type.Undefined()]), // key known
      "a'a": Type.Literal(8),
      '@onlyAtSymbol': Type.Literal(9),
    })
    Ok(T, {
      'with-hyphen': 1,
      '0-leading': 2,
      '$-leading': 3,
      '!@#$%^&*(': 4,
      'node-mirror:release:0': 5,
      'node-mirror:release:1': 6,
      'node-mirror:release:2': 7,
      "a'a": 8,
      '@onlyAtSymbol': 9,
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
  it('Should validate nested schema additional properties of string', () => {
    const T = Type.Object({
      nested: Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        {
          additionalProperties: Type.String(),
        },
      ),
    })
    Ok(T, {
      nested: {
        x: 1,
        y: 2,
        z: 'hello',
      },
    })
    Fail(T, {
      nested: {
        x: 1,
        y: 2,
        z: 3,
      },
    })
  })
  it('Should validate nested schema additional properties of array', () => {
    const T = Type.Object({
      nested: Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        {
          additionalProperties: Type.Array(Type.Number()),
        },
      ),
    })
    Ok(T, {
      nested: {
        x: 1,
        y: 2,
        z: [0, 1, 2],
      },
    })
    Fail(T, {
      nested: {
        x: 1,
        y: 2,
        z: 3,
      },
    })
  })
  it('Should validate nested schema additional properties of object', () => {
    const T = Type.Object({
      nested: Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        {
          additionalProperties: Type.Object({
            z: Type.Number(),
          }),
        },
      ),
    })
    Ok(T, {
      nested: {
        x: 1,
        y: 2,
        z: { z: 1 },
      },
    })
    Fail(T, {
      nested: {
        x: 1,
        y: 2,
        z: 3,
      },
    })
  })
  it('Should check for property key if property type is undefined', () => {
    const T = Type.Object({ x: Type.Undefined() })
    Ok(T, { x: undefined })
    Fail(T, {})
  })
  it('Should check for property key if property type extends undefined', () => {
    const T = Type.Object({ x: Type.Union([Type.Number(), Type.Undefined()]) })
    Ok(T, { x: 1 })
    Ok(T, { x: undefined })
    Fail(T, {})
  })
  it('Should not check for property key if property type is undefined and optional', () => {
    const T = Type.Object({ x: Type.Optional(Type.Undefined()) })
    Ok(T, { x: undefined })
    Ok(T, {})
  })
  it('Should not check for property key if property type extends undefined and optional', () => {
    const T = Type.Object({ x: Type.Optional(Type.Union([Type.Number(), Type.Undefined()])) })
    Ok(T, { x: 1 })
    Ok(T, { x: undefined })
    Ok(T, {})
  })
  it('Should check undefined for optional property of number', () => {
    const T = Type.Object({ x: Type.Optional(Type.Number()) })
    Ok(T, { x: 1 })
    Ok(T, { x: undefined }) // allowed by default
    Ok(T, {})
  })
  it('Should check undefined for optional property of undefined', () => {
    const T = Type.Object({ x: Type.Optional(Type.Undefined()) })
    Fail(T, { x: 1 })
    Ok(T, { x: undefined })
    Ok(T, {})
  })
  it('Should check for required property of any', () => {
    const T = Type.Object({ x: Type.Any() })
    Fail(T, {})
    Ok(T, { x: undefined })
    Ok(T, { x: 1 })
    Ok(T, { x: true })
  })
  it('Should check for required property of unknown', () => {
    const T = Type.Object({ x: Type.Unknown() })
    Fail(T, {})
    Ok(T, { x: undefined })
    Ok(T, { x: 1 })
    Ok(T, { x: true })
  })
  it('Should check for required property of any (when optional)', () => {
    const T = Type.Object({ x: Type.Optional(Type.Any()) })
    Ok(T, {})
    Ok(T, { x: undefined })
    Ok(T, { x: 1 })
    Ok(T, { x: true })
  })
  it('Should check for required property of unknown (when optional)', () => {
    const T = Type.Object({ x: Type.Optional(Type.Unknown()) })
    Ok(T, {})
    Ok(T, { x: undefined })
    Ok(T, { x: 1 })
    Ok(T, { x: true })
  })
})
