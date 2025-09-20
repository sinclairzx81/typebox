import Schema from 'typebox/schema'
import { Assert } from 'test'
import { Guard } from 'typebox/guard'

// ------------------------------------------------------------------
// The Schema Submodule is primarily tested via the JSON Schema
// compliance test suite. We add tests here to assert the calling
// interfaces only.
// ------------------------------------------------------------------
const Test = Assert.Context('Schema.Build:Result')

Test('Should Build 1', () => {
  const build = Schema.Build({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.IsTrue(Guard.IsBoolean(build.UseUnevaluated()))
})
Test('Should Build 2', () => {
  const build = Schema.Build({ type: 'string' })
  Assert.IsTrue(Guard.IsString(build.Call()))
})
Test('Should Build 3', () => {
  const build = Schema.Build({ type: 'string' })
  const variables = build.External()
  Assert.HasPropertyKey(variables, 'identifier')
  Assert.HasPropertyKey(variables, 'variables')
})
Test('Should Build 4', () => {
  const build = Schema.Build({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.IsTrue(Guard.IsArray(build.Functions()))
})
