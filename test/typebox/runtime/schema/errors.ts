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
// ------------------------------------------------------------------
// SchemaPath is EvaluationPath
// ------------------------------------------------------------------
Test('Should Errors 13', () => {
  // $ref
  const R = Schema.Errors({
    $ref: '#/$defs/A',
    $defs: {
      A: { $ref: '#/$defs/B' },
      B: { $ref: '#/$defs/C' },
      C: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { type: 'number' },
          y: { type: 'number' } // inlined as '#/properties/y' from root
        }
      }
    }
  }, { x: 1, y: null })[1]
  Assert.IsEqual(R[0].schemaPath, '#/properties/y')
})
Test('Should Errors 14', () => {
  // $recursiveRef
  const R = Schema.Errors({
    $recursiveRef: '#/$defs/A',
    $defs: {
      A: { $recursiveRef: '#/$defs/B' },
      B: { $recursiveRef: '#/$defs/C' },
      C: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { type: 'number' },
          y: { type: 'number' } // inlined as '#/properties/y' from root
        }
      }
    }
  }, { x: 1, y: null })[1]
  Assert.IsEqual(R[0].schemaPath, '#/properties/y')
})
Test('Should Errors 15', () => {
  // $dynamicRef
  const R = Schema.Errors({
    $dynamicRef: '#/$defs/A',
    $defs: {
      A: { $dynamicRef: '#/$defs/B' },
      B: { $dynamicRef: '#/$defs/C' },
      C: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { type: 'number' },
          y: { type: 'number' } // inlined as '#/properties/y' from root
        }
      }
    }
  }, { x: 1, y: null })[1]
  Assert.IsEqual(R[0].schemaPath, '#/properties/y')
})
Test('Should Errors 16', () => {
  // $ref > $recursiveRef > $dynamicRef
  const R = Schema.Errors({
    $ref: '#/$defs/A',
    $defs: {
      A: { $recursiveRef: '#/$defs/B' },
      B: { $dynamicRef: '#/$defs/C' },
      C: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { type: 'number' },
          y: { type: 'number' } // inlined as '#/properties/y' from root
        }
      }
    }
  }, { x: 1, y: null })[1]
  Assert.IsEqual(R[0].schemaPath, '#/properties/y')
})
// ------------------------------------------------------------------
// JSON Pointer Fragment Encoding
//
// Ref: https://github.com/sinclairzx81/typebox/issues/1694
// ------------------------------------------------------------------
Test('Should Errors 17', () => {
  const R = Schema.Errors({
    'type': 'object',
    'required': ['a', 'a/b', 'a~1b'],
    'properties': {
      'a': {
        'type': 'object',
        'required': ['b'],
        'properties': {
          'b': { 'type': 'number' }
        }
      },
      'a/b': { 'type': 'number' },
      'a~1b': { 'type': 'number' }
    }
  }, { 'a/b': 'literal slash', a: { b: 'nested' }, 'a~1b': 'literal tilde' })[1]
  Assert.IsEqual(R.map((error) => error.instancePath), ['/a/b', '/a~1b', '/a~01b'])
})
Test('Should Errors 18', () => {
  const R = Schema.Errors({
    'type': 'object',
    'properties': {},
    'additionalProperties': { 'type': 'number' }
  }, { 'a/b': 'x', 'a~b': 'y' })[1]
  Assert.IsEqual(R.map((error) => error.instancePath), ['/a~1b', '/a~0b', ''])
})
Test('Should Errors 19', () => {
  const R = Schema.Errors({
    'type': 'object',
    'patternProperties': {
      '^a/b$': { 'type': 'number' }
    }
  }, { 'a/b': 'x' })[1]
  Assert.IsEqual(R[0].instancePath, '/a~1b')
  Assert.IsEqual(R[0].schemaPath, '#/patternProperties/^a~1b$')
})
Test('Should Errors 20', () => {
  const R = Schema.Errors({
    'type': 'object',
    'propertyNames': { 'pattern': '^[a-z]+$' }
  }, { 'a/b': 1, 'a~b': 2 })[1]
  Assert.IsEqual(R.map((error) => error.instancePath), ['/a~1b', '/a~0b', ''])
})
Test('Should Errors 21', () => {
  const R = Schema.Errors({
    'type': 'object',
    'dependencies': {
      'a/b': { 'required': ['c'] }
    }
  }, { 'a/b': 1 })[1]
  Assert.IsEqual(R[0].schemaPath, '#/dependencies/a~1b')
})
Test('Should Errors 22', () => {
  const R = Schema.Errors({
    'type': 'object',
    'dependentSchemas': {
      'a/b': { 'required': ['c'] }
    }
  }, { 'a/b': 1 })[1]
  Assert.IsEqual(R[0].schemaPath, '#/dependentSchemas/a~1b')
})
