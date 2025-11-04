import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'
import { Settings } from 'typebox/system'

const Test = Assert.Context('Value.Check.Object')

// -----------------------------------------------------
// Standard Checks
// -----------------------------------------------------
Test('Should not validate a number', () => {
  const T = Type.Object({})
  Fail(T, 42)
})
Test('Should not validate a string', () => {
  const T = Type.Object({})
  Fail(T, 'hello')
})
Test('Should not validate a boolean', () => {
  const T = Type.Object({})
  Fail(T, true)
})
Test('Should not validate a null', () => {
  const T = Type.Object({})
  Fail(T, null)
})
Test('Should not validate undefined', () => {
  const T = Type.Object({})
  Fail(T, undefined)
})
Test('Should not validate bigint', () => {
  const T = Type.Object({})
  Fail(T, BigInt(1))
})
Test('Should not validate symbol', () => {
  const T = Type.Object({})
  Fail(T, Symbol(1))
})
Test('Should not validate an array', () => {
  const T = Type.Object({})
  Fail(T, [1, 2])
})
Test('Should validate with correct property values', () => {
  const T = Type.Object({
    a: Type.Number(),
    b: Type.String(),
    c: Type.Boolean(),
    d: Type.Array(Type.Number()),
    e: Type.Object({ x: Type.Number(), y: Type.Number() })
  })
  Ok(T, {
    a: 10,
    b: 'hello',
    c: true,
    d: [1, 2, 3],
    e: { x: 10, y: 20 }
  })
})
Test('Should not validate with incorrect property values', () => {
  const T = Type.Object({
    a: Type.Number(),
    b: Type.String(),
    c: Type.Boolean(),
    d: Type.Array(Type.Number()),
    e: Type.Object({ x: Type.Number(), y: Type.Number() })
  })
  Fail(T, {
    a: 'not a number', // error
    b: 'hello',
    c: true,
    d: [1, 2, 3],
    e: { x: 10, y: 20 }
  })
})
Test('Should allow additionalProperties by default', () => {
  const T = Type.Object({
    a: Type.Number(),
    b: Type.String()
  })
  Ok(T, {
    a: 1,
    b: 'hello',
    c: true
  })
})
Test('Should not allow an empty object if minProperties is set to 1', () => {
  const T = Type.Object(
    {
      a: Type.Optional(Type.Number()),
      b: Type.Optional(Type.String())
    },
    { additionalProperties: false, minProperties: 1 }
  )
  Ok(T, { a: 1 })
  Ok(T, { b: 'hello' })
  Fail(T, {})
})
Test('Should not allow 3 properties if maxProperties is set to 2', () => {
  const T = Type.Object(
    {
      a: Type.Optional(Type.Number()),
      b: Type.Optional(Type.String()),
      c: Type.Optional(Type.Boolean())
    },
    { additionalProperties: false, maxProperties: 2 }
  )
  Ok(T, { a: 1 })
  Ok(T, { a: 1, b: 'hello' })
  Fail(T, {
    a: 1,
    b: 'hello',
    c: true
  })
})
Test('Should not allow additionalProperties if additionalProperties is false', () => {
  const T = Type.Object(
    {
      a: Type.Number(),
      b: Type.String()
    },
    { additionalProperties: false }
  )
  Fail(T, {
    a: 1,
    b: 'hello',
    c: true
  })
})
Test('Should not allow properties for an empty object when additionalProperties is false', () => {
  const T = Type.Object({}, { additionalProperties: false })
  Ok(T, {})
  Fail(T, { a: 10 })
})

Test('Should validate with non-syntax property keys', () => {
  const T = Type.Object({
    'with-hyphen': Type.Literal(1),
    '0-leading': Type.Literal(2),
    '$-leading': Type.Literal(3),
    '!@#$%^&*(': Type.Literal(4),
    'node-mirror:release:0': Type.Literal(5), // issue: 353
    'node-mirror:release:1': Type.Optional(Type.Literal(6)), // issue: 356
    'node-mirror:release:2': Type.Union([Type.Literal(7), Type.Undefined()]), // key known
    "a'a": Type.Literal(8),
    '@onlyAtSymbol': Type.Literal(9)
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
    '@onlyAtSymbol': 9
  })
})
Test('Should validate schema additional properties of string', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  Ok(T, {
    x: 1,
    y: 2,
    z: 'hello'
  })
  Fail(T, {
    x: 1,
    y: 2,
    z: 3
  })
})
Test('Should validate schema additional properties of array', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.Array(Type.Number())
    }
  )
  Ok(T, {
    x: 1,
    y: 2,
    z: [0, 1, 2]
  })
  Fail(T, {
    x: 1,
    y: 2,
    z: 3
  })
})
Test('Should validate schema additional properties of object', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.Object({
        z: Type.Number()
      })
    }
  )
  Ok(T, {
    x: 1,
    y: 2,
    z: { z: 1 }
  })
  Fail(T, {
    x: 1,
    y: 2,
    z: 3
  })
})
Test('Should validate nested schema additional properties of string', () => {
  const T = Type.Object({
    nested: Type.Object(
      {
        x: Type.Number(),
        y: Type.Number()
      },
      {
        additionalProperties: Type.String()
      }
    )
  })
  Ok(T, {
    nested: {
      x: 1,
      y: 2,
      z: 'hello'
    }
  })
  Fail(T, {
    nested: {
      x: 1,
      y: 2,
      z: 3
    }
  })
})
Test('Should validate nested schema additional properties of array', () => {
  const T = Type.Object({
    nested: Type.Object(
      {
        x: Type.Number(),
        y: Type.Number()
      },
      {
        additionalProperties: Type.Array(Type.Number())
      }
    )
  })
  Ok(T, {
    nested: {
      x: 1,
      y: 2,
      z: [0, 1, 2]
    }
  })
  Fail(T, {
    nested: {
      x: 1,
      y: 2,
      z: 3
    }
  })
})
Test('Should validate nested schema additional properties of object', () => {
  const T = Type.Object({
    nested: Type.Object(
      {
        x: Type.Number(),
        y: Type.Number()
      },
      {
        additionalProperties: Type.Object({
          z: Type.Number()
        })
      }
    )
  })
  Ok(T, {
    nested: {
      x: 1,
      y: 2,
      z: { z: 1 }
    }
  })
  Fail(T, {
    nested: {
      x: 1,
      y: 2,
      z: 3
    }
  })
})
Test('Should check for property key if property type is undefined', () => {
  const T = Type.Object({ x: Type.Undefined() })
  Ok(T, { x: undefined })
  Fail(T, {})
})
Test('Should check for property key if property type extends undefined', () => {
  const T = Type.Object({ x: Type.Union([Type.Number(), Type.Undefined()]) })
  Ok(T, { x: 1 })
  Ok(T, { x: undefined })
  Fail(T, {})
})
Test('Should not check for property key if property type is undefined and optional', () => {
  const T = Type.Object({ x: Type.Optional(Type.Undefined()) })
  Ok(T, { x: undefined })
  Ok(T, {})
})
Test('Should not check for property key if property type extends undefined and optional', () => {
  const T = Type.Object({ x: Type.Optional(Type.Union([Type.Number(), Type.Undefined()])) })
  Ok(T, { x: 1 })
  Ok(T, { x: undefined })
  Ok(T, {})
})
Test('Should check for required property of any', () => {
  const T = Type.Object({ x: Type.Any() })
  Fail(T, {})
  Ok(T, { x: undefined })
  Ok(T, { x: 1 })
  Ok(T, { x: true })
})
Test('Should check for required property of unknown', () => {
  const T = Type.Object({ x: Type.Unknown() })
  Fail(T, {})
  Ok(T, { x: undefined })
  Ok(T, { x: 1 })
  Ok(T, { x: true })
})
Test('Should check for required property of any (when optional)', () => {
  const T = Type.Object({ x: Type.Optional(Type.Any()) })
  Ok(T, {})
  Ok(T, { x: undefined })
  Ok(T, { x: 1 })
  Ok(T, { x: true })
})
Test('Should check for required property of unknown (when optional)', () => {
  const T = Type.Object({ x: Type.Optional(Type.Unknown()) })
  Ok(T, {})
  Ok(T, { x: undefined })
  Ok(T, { x: 1 })
  Ok(T, { x: true })
})

// ------------------------------------------------------------------
// ExactOptionalPropertyTypes: FALSE
// ------------------------------------------------------------------
Test('Should use exactOptionalPropertyTypes FALSE 1', () => {
  const T = Type.Object({ x: Type.Optional(Type.Undefined()) })
  Fail(T, { x: true })
  Fail(T, { x: 1 })
  Ok(T, { x: undefined })
  Ok(T, {})
})
Test('Should use exactOptionalPropertyTypes FALSE 2', () => {
  const T = Type.Object({ x: Type.Optional(Type.Number()) })
  Fail(T, { x: true })
  Ok(T, { x: 1 })
  Ok(T, { x: undefined })
  Ok(T, {})
})
Test('Should use exactOptionalPropertyTypes FALSE 3', () => {
  const T = Type.Object({ x: Type.Optional(Type.Union([Type.Number(), Type.Undefined()])) })
  Fail(T, { x: true })
  Ok(T, { x: 1 })
  Ok(T, { x: undefined })
  Ok(T, {})
})
// ------------------------------------------------------------------
// ExactOptionalPropertyTypes: TRUE
// ------------------------------------------------------------------
Test('Should use exactOptionalPropertyTypes TRUE 1', () => {
  Settings.Set({ exactOptionalPropertyTypes: true })
  const T = Type.Object({ x: Type.Optional(Type.Undefined()) })
  Fail(T, { x: true })
  Fail(T, { x: 1 })
  Ok(T, { x: undefined })
  Ok(T, {})
  Settings.Reset()
})
Test('Should use exactOptionalPropertyTypes TRUE 2', () => {
  Settings.Set({ exactOptionalPropertyTypes: true })
  const T = Type.Object({ x: Type.Optional(Type.Number()) })
  Fail(T, { x: true })
  Ok(T, { x: 1 })
  Fail(T, { x: undefined })
  Ok(T, {})
  Settings.Reset()
})
Test('Should use exactOptionalPropertyTypes TRUE 3', () => {
  Settings.Set({ exactOptionalPropertyTypes: true })
  const T = Type.Object({ x: Type.Optional(Type.Union([Type.Number(), Type.Undefined()])) })
  Fail(T, { x: true })
  Ok(T, { x: 1 })
  Ok(T, { x: undefined })
  Ok(T, {})
  Settings.Reset()
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1442
//
// Issue caused by non-escaped properties key on additionalProperties check. The
// logic builds a regular expression used to test keys, but where the properties
// should be escaped if they contain regular expression symbols. We should replace
// this with explicit key comparisons as this may be faster (review)
// ------------------------------------------------------------------
Test('Should Escape Property Keys 1', () => {
  const U = Type.Object({ foo$: Type.String() }, { additionalProperties: false })
  Ok(U, { foo$: 'abc' })
})
Test('Should Escape Property Keys 2', () => {
  const T = Type.Object({ $foo: Type.String() }, { additionalProperties: false })
  Ok(T, { $foo: 'abc' })
})
Test('Should Escape Property Keys 3', () => {
  const T = Type.Object({ foo: Type.String() }, { additionalProperties: false })
  Ok(T, { foo: 'abc' })
})
