import { Settings } from 'typebox/system'
import Schema from 'typebox/schema'
import { Assert } from 'test'

// ------------------------------------------------------------------
// This module adds targeted tests to cover internal code paths that
// are not exercised by the standard JSON Schema Test Suite.
// ------------------------------------------------------------------
const Test = Assert.Context('Schema.Additional')

// ------------------------------------------------------------------
// Test 1: Covers the unevaluatedItems optimization path triggered by
// prefixItems. When unevaluatedItems is present, prefixItems should
// register their indices. This behavior is used for build-time
// optimization only.
// ------------------------------------------------------------------
Test('Should Coverage 1', () => {
  const evaluateResult = Schema.Build({
    prefixItems: [{ const: 1 }, { const: 2 }],
    unevaluatedItems: false
  }).Evaluate()

  Assert.IsTrue(evaluateResult.Check([1, 2]))
  Assert.IsFalse(evaluateResult.Check([1, 2, 3]))
})
// ------------------------------------------------------------------
// Test 2: Ensures unknown type values are handled correctly. JSON
// Schema ignores invalid constraints, including unknown types. These
// are treated as always valid. Since the official suite doesn’t test
// this, we verify that behavior here.
// ------------------------------------------------------------------
Test('Should Coverage 2', () => {
  const T = { type: 'an-unknown-type' }
  Assert.IsTrue(Schema.Build(T).Evaluate().Check(null))
  Assert.IsTrue(Schema.Check(T, null))
  Assert.IsEqual(Schema.Errors(T, null), [true, []])
})
// ------------------------------------------------------------------
// Test 3: Verifies behavior when maxErrors is set to 0. This disables
// error accumulation entirely and no errors are collected, even if
// validation fails. This scenario isn't covered by the test suite.
// ------------------------------------------------------------------
Test('Should Coverage 3', () => {
  const T = { type: 'string' }
  Settings.Set({ maxErrors: 0 })
  Assert.IsFalse(Schema.Build(T).Evaluate().Check(null))
  Assert.IsFalse(Schema.Check(T, null))
  Assert.IsEqual(Schema.Errors(T, null), [false, []])
  Settings.Reset()
})
// ------------------------------------------------------------------
// Test 4: Ensures support for multiple types via an array in the
// `type` keyword. This is interpreted as a logical OR (e.g., object
// OR null OR number). The test verifies that Schema.HasTypeName
// correctly handles type arrays.
//
// Including a non-type keyword like `properties` ensures the
// type-check logic is triggered, since it only runs when other
// schema keywords are present. If `type` is already defined,
// redundant guards are avoided, but the type array still needs
// to be properly processed.
// ------------------------------------------------------------------
Test('Should Coverage 4', () => {
  const T = { type: ['object', 'null', 'number'], properties: {} }
  // object
  Assert.IsTrue(Schema.Build(T).Evaluate().Check({}))
  Assert.IsTrue(Schema.Check(T, {}))
  Assert.IsEqual(Schema.Errors(T, {}), [true, []])
  // number
  Assert.IsTrue(Schema.Build(T).Evaluate().Check(1))
  Assert.IsTrue(Schema.Check(T, 1))
  Assert.IsEqual(Schema.Errors(T, 1), [true, []])
  // null
  Assert.IsTrue(Schema.Build(T).Evaluate().Check(null))
  Assert.IsTrue(Schema.Check(T, null))
  Assert.IsEqual(Schema.Errors(T, null), [true, []])
  // string (should fail)
  Assert.IsFalse(Schema.Build(T).Evaluate().Check('x'))
  Assert.IsFalse(Schema.Check(T, 'x'))
  Assert.IsFalse(Schema.Errors(T, 'x')[0])
})
// ------------------------------------------------------------------
// Multi-Variant: https://github.com/sinclairzx81/typebox/pull/1652
//
// These tests check that multi-variant types de-opt and compile
// correctly. We note that multi-variant types had been broken due
// to HasTypeName reporting true in multi-variant Union cases,
// for example ['null', 'object'] would crash on null as the
// 'object' guard was omitted on emit. We test here to ensure
// the compiler doesn't crash on null cases.
// ------------------------------------------------------------------
Test('Should Coverage 5', () => {
  const validator = Schema.Compile({ type: ['object', 'null'], properties: { value: { type: 'string' } } })
  Assert.IsTrue(validator.Check(null))
  Assert.IsTrue(validator.Check({ value: 'hello' }))
  Assert.IsFalse(validator.Check({ value: 1 }))
})
Test('Should Coverage 6', () => {
  const validator = Schema.Compile({ type: ['array', 'null'], items: { type: 'string' } })
  Assert.IsTrue(validator.Check(null))
  Assert.IsTrue(validator.Check(['hello']))
  Assert.IsFalse(validator.Check([1]))
})
Test('Should Coverage 7', () => {
  const validator = Schema.Compile({ type: ['string', 'null'], minLength: 1 })
  Assert.IsTrue(validator.Check(null))
  Assert.IsTrue(validator.Check('hello'))
  Assert.IsFalse(validator.Check(''))
})
Test('Should Coverage 8', () => {
  const validator = Schema.Compile({ type: ['number', 'null'], minimum: 1 })
  Assert.IsTrue(validator.Check(null))
  Assert.IsTrue(validator.Check(1))
  Assert.IsFalse(validator.Check(0))
})
// ------------------------------------------------------------------
// Multi-Variant: Coverage
// ------------------------------------------------------------------
Test('Should Coverage 9', () => {
  const validator = Schema.Compile({ type: ['bigint', 'null'] })
  Assert.IsTrue(validator.Check(null))
  Assert.IsTrue(validator.Check(1n))
  Assert.IsFalse(validator.Check(0))
})
Test('Should Coverage 10', () => {
  const validator = Schema.Compile({ type: ['bigint', 'number'] })
  Assert.IsTrue(validator.Check(1n))
  Assert.IsTrue(validator.Check(0))
  Assert.IsFalse(validator.Check(null))
})
Test('Should Coverage 11', () => {
  const validator = Schema.Compile({ type: ['null', 'null'] })
  Assert.IsTrue(validator.Check(null))
  Assert.IsFalse(validator.Check(0))
})
Test('Should Coverage 12', () => {
  const validator = Schema.Compile({ type: ['null', 'null', 'number'] })
  Assert.IsTrue(validator.Check(null))
  Assert.IsTrue(validator.Check(0))
  Assert.IsFalse(validator.Check(true))
})
Test('Should Coverage 13', () => {
  const validator = Schema.Compile({ type: ['array', 'object'] })
  Assert.IsTrue(validator.Check([]))
  Assert.IsTrue(validator.Check({}))
  Assert.IsFalse(validator.Check(0))
})
Test('Should Coverage 13', () => {
  const validator = Schema.Compile({ type: ['array', 'object', 'null'] })
  Assert.IsTrue(validator.Check([]))
  Assert.IsTrue(validator.Check({}))
  Assert.IsTrue(validator.Check(null))
  Assert.IsFalse(validator.Check(0))
})
Test('Should Coverage 14', () => {
  const validator = Schema.Compile({ type: ['boolean', 'object'] })
  Assert.IsTrue(validator.Check({}))
  Assert.IsTrue(validator.Check(true))
  Assert.IsTrue(validator.Check(false))
  Assert.IsFalse(validator.Check(0))
})
Test('Should Coverage 15', () => {
  const validator = Schema.Compile({
    type: ['array', 'object', 'null'],
    items: { type: 'number' },
    properties: { x: { type: 'number' } }
  })
  Assert.IsTrue(validator.Check([1, 2]))
  Assert.IsTrue(validator.Check({ x: 1 }))
  Assert.IsTrue(validator.Check(null))
  Assert.IsFalse(validator.Check([1, null]))
  Assert.IsFalse(validator.Check({ x: null }))
  Assert.IsFalse(validator.Check(0))
})
Test('Should Coverage 16', () => {
  const validator = Schema.Compile({
    type: ['array', 'object', 'null'],
    prefixItems: [{ type: 'number' }, { type: 'number' }],
    properties: { x: { type: 'number' } }
  })
  Assert.IsTrue(validator.Check([1, 2]))
  Assert.IsTrue(validator.Check({ x: 1 }))
  Assert.IsTrue(validator.Check(null))
  Assert.IsFalse(validator.Check([1, null]))
  Assert.IsFalse(validator.Check({ x: null }))
  Assert.IsFalse(validator.Check(0))
})
