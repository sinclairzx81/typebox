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
