import Guard from 'typebox/guard'
import System from 'typebox/system'
import Schema from 'typebox/schema'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Schema.Compile')

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
Test('Should Schema 1', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsEqual(validator.Schema(), { type: 'string' })
})
// ------------------------------------------------------------------
// IsAccelerated
// ------------------------------------------------------------------
Test('Should IsAccelerated 1', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsTrue(validator.IsAccelerated())
})
Test('Should IsAccelerated 2', () => {
  System.Settings.Set({ useAcceleration: false })
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsFalse(validator.IsAccelerated())
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// Without Context
// ------------------------------------------------------------------
Test('Should Compile 1', () => {
  const validator = Schema.Compile({ type: 'string' })
  const [result, errors] = validator.Errors(1)
  Assert.IsFalse(result)
  Assert.IsTrue(errors.length > 0)
})
Test('Should Compile 2', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsTrue(validator.Check('hello'))
})
Test('Should Compile 3', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsEqual(validator.Parse('hello'), 'hello')
})
Test('Should Compile 4', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.Throws(() => validator.Parse(1))
})
// ------------------------------------------------------------------
// With Context
// ------------------------------------------------------------------
Test('Should Compile 5', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  const [result, errors] = validator.Errors(1)
  Assert.IsFalse(result)
  Assert.IsTrue(errors.length > 0)
})
Test('Should Compile 6', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.IsTrue(validator.Check('hello'))
})
Test('Should Compile 7', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.IsEqual(validator.Parse('hello'), 'hello')
})
Test('Should Compile 8', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.Throws(() => validator.Parse(1))
})
// ------------------------------------------------------------------
// MaxParseErrors
// ------------------------------------------------------------------
Test('Should Compile 9', () => {
  try {
    Schema.Compile({
      type: 'object',
      required: ['x', 'y'],
      properties: {
        x: { type: 'number' },
        y: { type: 'number' }
      }
    }).Parse({ x: null, y: null })
  } catch (error: any) {
    Assert.IsTrue(Guard.IsArray(error.errors))
    Assert.IsEqual(error.errors.length, 1)
  }
})
Test('Should Compile 10', () => {
  System.Settings.Set({ maxParseErrors: 2 })
  try {
    Schema.Compile({
      type: 'object',
      required: ['x', 'y'],
      properties: {
        x: { type: 'number' },
        y: { type: 'number' }
      }
    }).Parse({ x: null, y: null })
  } catch (error: any) {
    Assert.IsTrue(Guard.IsArray(error.errors))
    Assert.IsEqual(error.errors.length, 2)
  } finally {
    System.Settings.Reset()
  }
})

// ------------------------------------------------------------------
// AdditionalProperties (fast path)
//
// `required` is satisfied by inherited keys because the engine tests
// `key in value`, while `additionalProperties` only inspects own
// property names. The compiled fast path must agree with the
// standard path for both shapes.
// ------------------------------------------------------------------
const AdditionalPropertiesSchema = Type.Object({ x: Type.Number() }, { additionalProperties: false })
const AdditionalPropertiesStandardSchema = Type.Object({ x: Type.Number() }, { additionalProperties: false, patternProperties: {} })

function Inherited(prototype: Record<string, unknown>, properties: Record<string, unknown> = {}): Record<string, unknown> {
  const value = Object.create(prototype)
  for (const [key, entry] of Object.entries(properties)) {
    Object.defineProperty(value, key, { value: entry, enumerable: true, writable: true, configurable: true })
  }
  return value
}
Test('Should Compile AdditionalProperties 1', () => {
  // required key inherited from the prototype: valid, and accepted by both paths
  const value = Inherited({ x: 1 })
  Assert.IsTrue(Schema.Check(AdditionalPropertiesSchema, value))
  Assert.IsTrue(Schema.Compile(AdditionalPropertiesSchema).Check(value))
})
Test('Should Compile AdditionalProperties 2', () => {
  // inherited required key plus one extra own key: invalid, rejected by both paths
  const value = Inherited({ x: 1 }, { y: 2 })
  Assert.IsFalse(Schema.Check(AdditionalPropertiesSchema, value))
  Assert.IsFalse(Schema.Compile(AdditionalPropertiesSchema).Check(value))
})
Test('Should Compile AdditionalProperties 3', () => {
  // the own property count equals required.length but the key is wrong
  Assert.IsFalse(Schema.Check(AdditionalPropertiesSchema, { y: 2 }))
  Assert.IsFalse(Schema.Compile(AdditionalPropertiesSchema).Check({ y: 2 }))
})
Test('Should Compile AdditionalProperties 4', () => {
  // control: exactly the required own key is valid
  Assert.IsTrue(Schema.Check(AdditionalPropertiesSchema, { x: 1 }))
  Assert.IsTrue(Schema.Compile(AdditionalPropertiesSchema).Check({ x: 1 }))
})
Test('Should Compile AdditionalProperties 5', () => {
  // control: an extra own key with a differing count is invalid
  Assert.IsFalse(Schema.Check(AdditionalPropertiesSchema, { x: 1, y: 2 }))
  Assert.IsFalse(Schema.Compile(AdditionalPropertiesSchema).Check({ x: 1, y: 2 }))
})
Test('Should Compile AdditionalProperties 6', () => {
  // control: fast path and standard path agree on the same values
  const values = [
    {},
    { x: 1 },
    { y: 2 },
    { x: 1, y: 2 },
    Inherited({ x: 1 }),
    Inherited({ x: 1 }, { y: 2 }),
    Object.create(null)
  ]
  for (const value of values) {
    Assert.IsEqual(Schema.Compile(AdditionalPropertiesSchema).Check(value), Schema.Check(AdditionalPropertiesSchema, value))
    Assert.IsEqual(Schema.Compile(AdditionalPropertiesStandardSchema).Check(value), Schema.Check(AdditionalPropertiesStandardSchema, value))
  }
})
Test('Should Compile AdditionalProperties 7', () => {
  // non-enumerable own properties participate in `additionalProperties` on both paths
  const value = Object.defineProperty({}, 'x', { value: 1, enumerable: false })
  Assert.IsTrue(Schema.Check(AdditionalPropertiesSchema, value))
  Assert.IsTrue(Schema.Compile(AdditionalPropertiesSchema).Check(value))
})
