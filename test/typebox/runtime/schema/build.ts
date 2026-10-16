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
  const buildResult = Schema.Build({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.IsTrue(Guard.IsBoolean(buildResult.UseUnevaluated()))
})
Test('Should Build 2', () => {
  const buildResult = Schema.Build({ type: 'string' })
  Assert.IsTrue(Guard.IsString(buildResult.Entry()))
})
Test('Should Build 3', () => {
  const buildResult = Schema.Build({ type: 'string' })
  const external = buildResult.External()
  Assert.HasPropertyKey(external, 'identifier')
  Assert.HasPropertyKey(external, 'variables')
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
// ------------------------------------------------------------------
// Idempotent Tests
// ------------------------------------------------------------------
function AssertIdempotent(schema: Schema.XSchema): void {
  const A = Schema.Build(schema).Evaluate().Code()
  const B = Schema.Build(schema).Evaluate().Code()
  Assert.IsEqual(A, B)
}
Test('Should Build 7', () => {
  AssertIdempotent({
    type: 'object',
    properties: { value: { type: 'string' } },
    additionalProperties: false
  })
})
Test('Should Build 8', () => {
  AssertIdempotent({
    type: 'array',
    items: [{ type: 'string' }],
    additionalItems: { type: 'number' }
  })
})
Test('Should Build 9', () => {
  AssertIdempotent({
    type: 'array',
    items: [{ type: 'string' }],
    additionalItems: { type: 'number' },
    unevaluatedItems: false
  })
})
Test('Should Build 10', () => {
  AssertIdempotent({
    type: 'array',
    contains: { type: 'string' }
  })
})
Test('Should Build 11', () => {
  AssertIdempotent({
    type: 'array',
    contains: { type: 'string' },
    unevaluatedItems: false
  })
})
Test('Should Build 12', () => {
  AssertIdempotent({
    type: 'array',
    contains: { type: 'string' },
    maxContains: 2
  })
})
Test('Should Build 13', () => {
  AssertIdempotent({
    type: 'array',
    contains: { type: 'string' },
    minContains: 1
  })
})
Test('Should Build 14', () => {
  AssertIdempotent({
    type: 'array',
    contains: { type: 'string' },
    minContains: 1,
    unevaluatedItems: false
  })
})
Test('Should Build 15', () => {
  AssertIdempotent({
    oneOf: [{ type: 'string' }, { type: 'number' }]
  })
})
Test('Should Build 16', () => {
  AssertIdempotent({
    type: 'object',
    patternProperties: { '^x': { type: 'string' } }
  })
})
Test('Should Build 17', () => {
  AssertIdempotent({
    type: 'object',
    propertyNames: { pattern: /^x/ }
  })
})
Test('Should Build 18', () => {
  AssertIdempotent({
    type: 'array',
    unevaluatedItems: false
  })
})
Test('Should Build 19', () => {
  AssertIdempotent({
    type: 'object',
    unevaluatedProperties: false
  })
})
