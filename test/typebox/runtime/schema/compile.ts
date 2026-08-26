import System from 'typebox/system'
import Schema from 'typebox/schema'
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
// Sparse Arrays
//
// An array hole reads as undefined and is validated as such. The
// accelerated validator must agree with Schema.Check, which iterates
// by index rather than through the hole-skipping array methods.
// ------------------------------------------------------------------
function Partial(): unknown[] {
  const value: unknown[] = []
  value[2] = 1
  return value // [<hole>, <hole>, 1]
}
function Holes(): unknown[] {
  return new Array(3) // [<hole>, <hole>, <hole>]
}
Test('Should Compile 9', () => {
  const schema = { type: 'array', items: { type: 'number' } }
  const validator = Schema.Compile(schema)
  Assert.IsTrue(validator.IsAccelerated())
  Assert.IsFalse(validator.Check(Partial()))
  Assert.IsEqual(validator.Check(Partial()), Schema.Check(schema, Partial()))
})
Test('Should Compile 10', () => {
  const schema = { type: 'array', items: { type: 'number' }, maxItems: 3 }
  const validator = Schema.Compile(schema)
  Assert.IsFalse(validator.Check(Holes()))
  Assert.IsEqual(validator.Check(Holes()), Schema.Check(schema, Holes()))
})
Test('Should Compile 11', () => {
  const schema = { type: 'array', items: false }
  const validator = Schema.Compile(schema)
  Assert.IsFalse(validator.Check(Holes()))
  Assert.IsEqual(validator.Check(Holes()), Schema.Check(schema, Holes()))
})
Test('Should Compile 12', () => {
  const schema = { type: 'array', unevaluatedItems: false }
  const validator = Schema.Compile(schema)
  Assert.IsFalse(validator.Check(Holes()))
  Assert.IsEqual(validator.Check(Holes()), Schema.Check(schema, Holes()))
})
Test('Should Compile 13', () => {
  const schema = { type: 'array', unevaluatedItems: { type: 'number' } }
  const validator = Schema.Compile(schema)
  Assert.IsFalse(validator.Check(Holes()))
  Assert.IsEqual(validator.Check(Holes()), Schema.Check(schema, Holes()))
})
Test('Should Compile 14', () => {
  const schema = { type: 'array', contains: { type: 'undefined' } }
  const validator = Schema.Compile(schema)
  Assert.IsTrue(validator.Check(Partial()))
  Assert.IsEqual(validator.Check(Partial()), Schema.Check(schema, Partial()))
})
Test('Should Compile 15', () => {
  const schema = { type: 'array', contains: { type: 'undefined' } }
  const validator = Schema.Compile(schema)
  Assert.IsTrue(validator.Check(Holes()))
  Assert.IsEqual(validator.Check(Holes()), Schema.Check(schema, Holes()))
})
Test('Should Compile 16', () => {
  // dense arrays are unchanged
  const schema = { type: 'array', items: { type: 'number' } }
  const validator = Schema.Compile(schema)
  Assert.IsTrue(validator.Check([1, 2, 3]))
  Assert.IsFalse(validator.Check([1, 'x', 3]))
  Assert.IsTrue(validator.Check([]))
})
