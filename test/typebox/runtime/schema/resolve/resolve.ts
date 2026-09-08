import { Assert } from 'test'
import Schema from 'typebox/schema'

const Test = Assert.Context('Schema.Resolve')

// ------------------------------------------------------------------
// These Tests Assert Schema Resolution Mechanisms. These are quite
// difficult to test in isolation due to the complexity as resolution
// typically occurs in the context of schema evaluation and traversal.
// This test asserts on known resolution behaviors to catch regressions.
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Resolve.Ref
// ------------------------------------------------------------------
Test('Should Resolve.Ref 1', () => {
  const A = { $defs: { A: { type: 'string' } } }
  const B = Schema.Stack({}, A)
  const C = Schema.Resolve.Ref(B, { $ref: '#/$defs/A' }).schema
  Assert.IsEqual(C, { type: 'string' })
})
Test('Should Resolve.Ref 2', () => {
  const A = {
    $id: 'https://example.com/root/',
    $defs: { A: { $id: 'A', type: 'string' } }
  }
  const B = Schema.Stack({}, A)
  const C = Schema.Resolve.Ref(B, { $ref: 'A' }).schema
  Assert.IsEqual(C, { $id: 'A', type: 'string' })
})
Test('Should Resolve.Ref 3', () => {
  const A = {}
  const B = Schema.Stack({ 'https://example.com/remote.json': { type: 'number' } }, A)
  const C = Schema.Resolve.Ref(B, { $ref: 'https://example.com/remote.json' }).schema
  Assert.IsEqual(C, { type: 'number' })
})
Test('Should Resolve.Ref 4', () => {
  const A = {}
  const B = Schema.Stack({ 'https://example.com/remote.json': { $defs: { A: { type: 'boolean' } } } }, A)
  const C = Schema.Resolve.Ref(B, { $ref: 'https://example.com/remote.json#/$defs/A' }).schema
  Assert.IsEqual(C, { type: 'boolean' })
})
// ------------------------------------------------------------------
// Resolve.RecursiveRef
// ------------------------------------------------------------------
Test('Should Resolve.RecursiveRef 1', () => {
  const A = { $recursiveAnchor: true, type: 'string' }
  const B = Schema.NextStack(Schema.Stack({}, A), A)
  const C = Schema.Resolve.RecursiveRef(B, { $recursiveRef: '#' })
  Assert.IsEqual(C, A)
})
Test('Should Resolve.RecursiveRef 2', () => {
  const A = { type: 'string' }
  const B = Schema.NextStack(Schema.Stack({}, A), A)
  const C = Schema.Resolve.RecursiveRef(B, { $recursiveRef: '#' })
  Assert.IsEqual(C, A)
})
Test('Should Resolve.RecursiveRef 3', () => {
  const A = { $id: 'https://example.com/root/', $recursiveAnchor: true, $defs: { X: { type: 'string' } } }
  const B = { $id: 'child', $recursiveAnchor: true, $defs: { X: { type: 'number' } } }
  const C = Schema.NextStack(Schema.NextStack(Schema.Stack({}, A), A), B)
  const D = Schema.Resolve.RecursiveRef(C, { $recursiveRef: '#/$defs/X' })
  Assert.IsEqual(D, { type: 'string' })
})
Test('Should Resolve.RecursiveRef 4', () => {
  const A = { type: 'boolean' }
  const B = Schema.Stack({}, { $defs: { A } })
  const C = Schema.Resolve.RecursiveRef(B, { $recursiveRef: '#/definitions/A' })
  Assert.IsEqual(C, undefined)
})
// ------------------------------------------------------------------
// Resolve.DynamicRef
// ------------------------------------------------------------------
Test('Should Resolve.DynamicRef 1', () => {
  const A = { $dynamicAnchor: 'A', type: 'string' }
  const B = Schema.Stack({}, A)
  const C = Schema.Resolve.DynamicRef(B, { $dynamicRef: '#A' })
  Assert.IsEqual(C, A)
})
Test('Should Resolve.DynamicRef 2', () => {
  const A = { $dynamicAnchor: 'A', type: 'string' }
  const B = { $dynamicAnchor: 'A', type: 'number' }
  const C = Schema.NextStack(Schema.Stack({}, A), B)
  const D = Schema.Resolve.DynamicRef(C, { $dynamicRef: '#A' })
  Assert.IsEqual(D, B)
})
Test('Should Resolve.DynamicRef 3', () => {
  const A = { $dynamicAnchor: 'A', type: 'boolean' }
  const B = Schema.NextStack(Schema.Stack({}, {}), A)
  const C = Schema.Resolve.DynamicRef(B, { $dynamicRef: '#A' })
  Assert.IsEqual(C, A)
})
Test('Should Resolve.DynamicRef 4', () => {
  const A = { $dynamicAnchor: 'A', type: 'boolean' }
  const B = Schema.Stack({}, { $defs: [A] })
  const C = Schema.Resolve.DynamicRef(B, { $dynamicRef: '#A' })
  Assert.IsEqual(C, A)
})
Test('Should Resolve.DynamicRef 5', () => {
  const A = { $dynamicAnchor: 'A', type: 'boolean' }
  const B = Schema.Stack({}, { $defs: { A } })
  const C = Schema.Resolve.DynamicRef(B, { $dynamicRef: '#A' })
  Assert.IsEqual(C, A)
})
Test('Should Resolve.DynamicRef 6', () => {
  const A = { $dynamicAnchor: 'A', type: 'boolean' }
  const B = Schema.Stack({}, { $defs: { A } })
  const C = Schema.Resolve.DynamicRef(B, { $dynamicRef: '#B' })
  Assert.IsEqual(C, undefined)
})
// ------------------------------------------------------------------
// Resolve.Ref Next Evaluation
// ------------------------------------------------------------------
Test('Should Resolve.Ref Next Evaluation 1', () => {
  const A = Schema.Stack({}, true)
  Assert.IsEqual(A.schema, true)
  Assert.IsEqual(A.lexicalSchema, true)
})
Test('Should Resolve.Ref Next Evaluation 2', () => {
  const A = { $id: 'widget', type: 'string' }
  const B = { $id: 'https://example.com/root/', $defs: { widget: A } }
  const C = Schema.NextStack(Schema.NextStack(Schema.Stack({}, B), B), A)
  const D = Schema.Resolve.Ref(C, { $ref: '#' }).schema
  Assert.IsEqual(D, A)
})
// ------------------------------------------------------------------
// URN Base Resolution
// ------------------------------------------------------------------
Test('Should Resolve.Ref Urn 1', () => {
  const A = { $id: 'widget', type: 'string' }
  const B = { $defs: { widget: A } }
  const C = Schema.NextStack(Schema.Stack({}, B), A)
  Assert.IsEqual(C.lexicalBase, 'urn:typebox:root:widget')
  const D = Schema.Resolve.Ref(C, { $ref: 'widget' }).schema
  Assert.IsEqual(D, A)
  const E = Schema.Resolve.Ref(C, { $ref: 'widget' }).stack
  Assert.IsEqual(E.referenceBase, 'urn:typebox:root:widget')
})
Test('Should Resolve.Ref Urn 2', () => {
  const A = { $defs: { A: { type: 'string' } } }
  const B = Schema.Stack({}, A)
  const C = Schema.Resolve.Ref(B, { $ref: '#/$defs/A' }).schema
  Assert.IsEqual(C, { type: 'string' })
})
