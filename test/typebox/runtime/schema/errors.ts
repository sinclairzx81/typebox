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
