import System from 'typebox/system'
import Schema from 'typebox/schema'
import { Assert } from 'test'

// ------------------------------------------------------------------
// The Schema Submodule is primarily tested via the JSON Schema
// compliance test suite. We add tests here to assert the calling
// interfaces only.
// ------------------------------------------------------------------
const Test = Assert.Context('Schema.Errors:Interface')

Test('Should Errors 1', () => {
  const [ok, errors] = Schema.Errors({ type: 'string' }, 'hello')
  Assert.IsTrue(ok)
  Assert.IsTrue(errors.length === 0)
})
Test('Should Errors 2', () => {
  const [ok, errors] = Schema.Errors({ type: 'string' }, 1)
  Assert.IsFalse(ok)
  Assert.IsTrue(errors.length > 0)
})
Test('Should Errors 3', () => {
  const [ok, errors] = Schema.Errors({ A: { type: 'string' } }, { $ref: 'A' }, 'hello')
  Assert.IsTrue(ok)
  Assert.IsTrue(errors.length === 0)
})
Test('Should Errors 4', () => {
  const [ok, errors] = Schema.Errors({ A: { type: 'string' } }, { $ref: 'A' }, 1)
  Assert.IsFalse(ok)
  Assert.IsTrue(errors.length > 0)
})
// ------------------------------------------------------------------
// MaxErrors:
// ------------------------------------------------------------------
const Vector = {
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
}
// ------------------------------------------------------------------
// MaxErrors: Accumulate Up to MaxError
// ------------------------------------------------------------------
Test('Should Errors 5', () => {
  System.Settings.Set({ maxErrors: 1 })
  const [ok, errors] = Schema.Errors(Vector, { x: null, y: null, z: null })
  Assert.IsFalse(ok)
  Assert.IsEqual(errors.length, 1)
  System.Settings.Reset()
})
Test('Should Errors 6', () => {
  System.Settings.Set({ maxErrors: 2 })
  const [ok, errors] = Schema.Errors(Vector, { x: null, y: null, z: null })
  Assert.IsFalse(ok)
  Assert.IsEqual(errors.length, 2)
  System.Settings.Reset()
})
Test('Should Errors 7', () => {
  System.Settings.Set({ maxErrors: 3 })
  const [ok, errors] = Schema.Errors(Vector, { x: null, y: null, z: null })
  Assert.IsFalse(ok)
  Assert.IsEqual(errors.length, 3)
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// MaxErrors: Ensure Partial Errors are Collected
// ------------------------------------------------------------------
Test('Should Errors 8', () => {
  System.Settings.Set({ maxErrors: 3 })
  const [ok, errors] = Schema.Errors(Vector, { x: 1, y: null, z: null })
  Assert.IsFalse(ok)
  Assert.IsEqual(errors.length, 2)
  System.Settings.Reset()
})
Test('Should Errors 9', () => {
  System.Settings.Set({ maxErrors: 3 })
  const [ok, errors] = Schema.Errors(Vector, { x: 1, y: 1, z: null })
  Assert.IsFalse(ok)
  Assert.IsEqual(errors.length, 1)
  System.Settings.Reset()
})
Test('Should Errors 10', () => {
  System.Settings.Set({ maxErrors: 3 })
  const [ok, errors] = Schema.Errors(Vector, { x: 1, y: 1, z: 1 })
  Assert.IsTrue(ok)
  Assert.IsEqual(errors.length, 0)
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// MaxErrors: MaxErrors of Zero is Always False
//
// IMPORTANT: When MaxErrors is 0, no assertion logic runs, so we
// have no meaningful basis for the result. The safest option is to
// report 'false', even in cases where the value would otherwise be
// valid. We do this because Errors() is a diagnostic function, not
// a checker: the boolean result indicates whether an error was
// found, not whether the full schema is satisfied. As a result,
// callers who set maxErrors to 0 and then call Errors() for
// diagnostics will always get 'false' back.
//
// (review) -> remove boolean return from Errors()
//
// ------------------------------------------------------------------
Test('Should Errors 11', () => {
  System.Settings.Set({ maxErrors: 0 })
  const [ok, errors] = Schema.Errors(Vector, { x: null, y: null, z: null })
  Assert.IsFalse(ok)
  Assert.IsEqual(errors.length, 0)
  System.Settings.Reset()
})
Test('Should Errors 12', () => {
  System.Settings.Set({ maxErrors: 0 })
  const [ok, errors] = Schema.Errors(Vector, { x: 1, y: 1, z: 1 })
  Assert.IsFalse(ok) // false, because no assertion was run.
  Assert.IsEqual(errors.length, 0)
  System.Settings.Reset()
})
