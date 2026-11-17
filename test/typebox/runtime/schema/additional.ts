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
// ------------------------------------------------------------------
// Coverage: Non-resolvable RecursiveRef and DynamicRef is false.
// ------------------------------------------------------------------
Test('Should Coverage 17', () => {
  const schema = { $dynamicRef: '#non-resolvable' }
  const validator = Schema.Compile(schema)
  Assert.IsFalse(validator.Check(1))
  Assert.IsFalse(Schema.Check(schema, 1))
  Assert.IsFalse(Schema.Errors(schema, 1)[0])
})
Test('Should Coverage 18', () => {
  const schema = { $recursiveRef: '#non-resolvable' }
  const validator = Schema.Compile(schema)
  Assert.IsFalse(validator.Check(1))
  Assert.IsFalse(Schema.Check(schema, 1))
  Assert.IsFalse(Schema.Errors(schema, 1)[0])
})
// ------------------------------------------------------------------
// Annotation Scope: Keys and indices evaluated by one schema must only
// be visible to unevaluatedProperties and unevaluatedItems in that
// schema (or a parent), and only when the evaluating subschema passes.
// Each case is asserted across Build, Check and Errors.
// ------------------------------------------------------------------
function AssertScope(schema: object, value: unknown, expect: boolean) {
  Assert.IsEqual(Schema.Build(schema).Evaluate().Check(value), expect)
  Assert.IsEqual(Schema.Check(schema, value), expect)
  const [valid, errors] = Schema.Errors(schema, value)
  Assert.IsEqual(valid, expect)
  Assert.IsEqual(errors.length === 0, expect)
}
Test('Should Scope Annotations 1', () => {
  // parent properties are not visible to unevaluatedProperties in then
  const schema = { properties: { a: true }, if: true, then: { unevaluatedProperties: false } }
  AssertScope(schema, { a: 1 }, false)
  AssertScope(schema, {}, true)
})
Test('Should Scope Annotations 2', () => {
  // if annotations are not visible to unevaluatedItems in then
  const schema = { if: { unevaluatedItems: true }, then: { unevaluatedItems: false } }
  AssertScope(schema, [1], false)
  AssertScope(schema, [], true)
})
Test('Should Scope Annotations 3', () => {
  // annotations from a failing if do not reach the parent
  const schema = { if: { properties: { a: true, b: true }, required: ['b'] }, unevaluatedProperties: false }
  AssertScope(schema, { a: 1 }, false)
  AssertScope(schema, { a: 1, b: 1 }, true)
})
Test('Should Scope Annotations 4', () => {
  // annotations from a passing if and then reach the parent
  const schema = {
    if: { properties: { a: { const: 1 } } },
    then: { properties: { b: true } },
    else: { properties: { a: true, c: true } },
    unevaluatedProperties: false
  }
  AssertScope(schema, { a: 1, b: 1 }, true)
  AssertScope(schema, { a: 1, c: 1 }, false)
  AssertScope(schema, { a: 2, c: 1 }, true)
  AssertScope(schema, { a: 2, b: 1 }, false)
})
Test('Should Scope Annotations 5', () => {
  // parent properties are not visible to unevaluatedProperties in dependentSchemas
  const schema = { additionalProperties: true, dependentSchemas: { a: { unevaluatedProperties: false } } }
  AssertScope(schema, { a: 1 }, false)
  AssertScope(schema, { b: 1 }, true)
})
Test('Should Scope Annotations 6', () => {
  // annotations from dependentSchemas reach the parent
  const schema = { properties: { a: true }, dependentSchemas: { a: { properties: { b: true } } }, unevaluatedProperties: false }
  AssertScope(schema, { a: 1, b: 1 }, true)
  AssertScope(schema, { b: 1 }, false)
})
Test('Should Scope Annotations 7', () => {
  // annotations from a failing not subschema do not reach the parent
  const schema = { not: { properties: { a: true }, minProperties: 2 }, unevaluatedProperties: false }
  AssertScope(schema, { a: 1 }, false)
  AssertScope(schema, {}, true)
})
Test('Should Scope Annotations 8', () => {
  // unevaluatedItems and unevaluatedProperties evaluate items in their own scope
  AssertScope({ unevaluatedItems: { unevaluatedItems: false } }, [1, ['a']], false)
  AssertScope({ unevaluatedItems: { unevaluatedItems: false } }, [1, []], true)
  AssertScope({ properties: { x: true }, unevaluatedProperties: { properties: { y: true }, unevaluatedProperties: false } }, { z: { x: 1 } }, false)
  AssertScope({ properties: { x: true }, unevaluatedProperties: { properties: { y: true }, unevaluatedProperties: false } }, { z: { y: 1 } }, true)
})
Test('Should Scope Annotations 9', () => {
  // contains evaluates items in their own scope
  const schema = { contains: { unevaluatedItems: false }, unevaluatedItems: false }
  AssertScope(schema, [[], [1]], false)
  AssertScope(schema, [[], []], true)
})
Test('Should Scope Annotations 10', () => {
  // unevaluatedProperties does not apply to arrays
  AssertScope({ unevaluatedProperties: false }, [1, 2], true)
  AssertScope({ anyOf: [{ type: 'array' }, { type: 'object' }], unevaluatedProperties: false }, ['a'], true)
  AssertScope({ anyOf: [{ type: 'array' }, { type: 'object' }], unevaluatedProperties: false }, { a: 1 }, false)
})
