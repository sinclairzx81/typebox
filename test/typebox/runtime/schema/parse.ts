import Guard from 'typebox/guard'
import System from 'typebox/system'
import Schema from 'typebox/schema'
import { Assert } from 'test'

// ------------------------------------------------------------------
// The Schema Submodule is primarily tested via the JSON Schema
// compliance test suite. We add tests here to assert the calling
// interfaces only.
// ------------------------------------------------------------------
const Test = Assert.Context('Schema.Parse:Interface')

Test('Should Parse 1', () => {
  const R = Schema.Parse({ type: 'string' }, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Parse 2', () => {
  Assert.Throws(() => Schema.Parse({ type: 'string' }, 1))
})
Test('Should Parse 3', () => {
  const R = Schema.Parse({ A: { type: 'string' } }, { $ref: 'A' }, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Parse 4', () => {
  Assert.Throws(() => Schema.Parse({ A: { type: 'string' } }, { $ref: 'A' }, 1))
})
// ------------------------------------------------------------------
// MaxParseErrors
// ------------------------------------------------------------------
Test('Should Parse 5', () => {
  try {
    Schema.Parse({
      type: 'object',
      required: ['x', 'y'],
      properties: {
        x: { type: 'number' },
        y: { type: 'number' }
      }
    }, { x: null, y: null })
  } catch (error: any) {
    Assert.IsTrue(Guard.IsArray(error.errors))
    Assert.IsEqual(error.errors.length, 1)
  }
})
Test('Should Parse 6', () => {
  System.Settings.Set({ maxParseErrors: 2 })
  try {
    Schema.Parse({
      type: 'object',
      required: ['x', 'y'],
      properties: {
        x: { type: 'number' },
        y: { type: 'number' }
      }
    }, { x: null, y: null })
  } catch (error: any) {
    Assert.IsTrue(Guard.IsArray(error.errors))
    Assert.IsEqual(error.errors.length, 2)
  } finally {
    System.Settings.Reset()
  }
})
