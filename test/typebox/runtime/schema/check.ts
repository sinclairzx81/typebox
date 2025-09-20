import Schema from 'typebox/schema'
import { Assert } from 'test'

// ------------------------------------------------------------------
// The Schema Submodule is primarily tested via the JSON Schema
// compliance test suite. We add tests here to assert the calling
// interfaces only.
// ------------------------------------------------------------------
const Test = Assert.Context('Schema.Check:Interface')

Test('Should Check 1', () => {
  const R = Schema.Check({ type: 'string' }, 'hello')
  Assert.IsTrue(R)
})

Test('Should Check 2', () => {
  const R = Schema.Check({ type: 'string' }, 1)
  Assert.IsFalse(R)
})

Test('Should Check 3', () => {
  const R = Schema.Check({ A: { type: 'string' } }, { $ref: 'A' }, 'hello')
  Assert.IsTrue(R)
})

Test('Should Check 4', () => {
  const R = Schema.Check({ A: { type: 'string' } }, { $ref: 'A' }, 1)
  Assert.IsFalse(R)
})
