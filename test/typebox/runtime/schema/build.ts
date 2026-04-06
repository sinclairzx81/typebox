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
// ------------------------------------------------------------------
// Extern: Support Multiple Non-Ordered Deferred Build
// ------------------------------------------------------------------
Test('Should Build 5', () => {
  const A = Schema.Build({ pattern: /^a$/ })
  const B = Schema.Build({ pattern: /^b$/ })
  const C = Schema.Build({ pattern: /^c$/ })
  // Non-Ordered
  const C_ = C.Evaluate().Check('c')
  const B_ = B.Evaluate().Check('b')
  const A_ = A.Evaluate().Check('a')
  Assert.IsTrue(C_)
  Assert.IsTrue(B_)
  Assert.IsTrue(A_)
})
Test('Should Build 6', () => {
  const A = Schema.Build({ pattern: /^a$/ })
  const B = Schema.Build({ pattern: /^b$/ })
  const C = Schema.Build({ pattern: /^c$/ })
  // Non-Ordered: Invariant
  const C_ = C.Evaluate().Check('b')
  const B_ = B.Evaluate().Check('a')
  const A_ = A.Evaluate().Check('c')
  Assert.IsFalse(C_)
  Assert.IsFalse(B_)
  Assert.IsFalse(A_)
})
