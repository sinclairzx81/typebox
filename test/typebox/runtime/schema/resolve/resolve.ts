import { Assert } from 'test'
import Schema from 'typebox/schema'

const Test = Assert.Context('Schema.Resolve')

// ------------------------------------------------------------------
// Resolve.Ref
// ------------------------------------------------------------------
Test('Should Resolve.Ref 1', () => {
  const A = Schema.Resolve.Ref({}, { $defs: { A: { type: 'string' } } }, '', '#/$defs/A')
  Assert.IsEqual(A, { type: 'string' })
})
Test('Should Resolve.Ref 2', () => {
  const A = Schema.Resolve.Ref(
    {},
    {
      $id: 'https://example.com/root/',
      $defs: { A: { $id: 'A', type: 'string' } }
    },
    '',
    'A'
  )
  Assert.IsEqual(A, { $id: 'A', type: 'string' })
})
Test('Should Resolve.Ref 3', () => {
  const A = Schema.Resolve.Ref(
    {
      'https://example.com/remote.json': { type: 'number' }
    },
    {},
    '',
    'https://example.com/remote.json'
  )
  Assert.IsEqual(A, { type: 'number' })
})
Test('Should Resolve.Ref 4', () => {
  const A = Schema.Resolve.Ref(
    {
      'https://example.com/remote.json': { $defs: { A: { type: 'boolean' } } }
    },
    {},
    '',
    'https://example.com/remote.json#/$defs/A'
  )
  Assert.IsEqual(A, { type: 'boolean' })
})
// ------------------------------------------------------------------
// Resolve.DynamicRef
// ------------------------------------------------------------------
Test('Should Resolve.DynamicRef 1', () => {
  const A = { $dynamicAnchor: 'A', type: 'string' }
  const R = Schema.Resolve.DynamicRef({}, A, '', A, { $dynamicRef: '#A' }, [])
  Assert.IsEqual(R, A)
})
Test('Should Resolve.DynamicRef 2', () => {
  const A = { $dynamicAnchor: 'A', type: 'string' }
  const B = { $dynamicAnchor: 'A', type: 'number' }
  const R = Schema.Resolve.DynamicRef({}, A, '', A, { $dynamicRef: '#A' }, [B])
  Assert.IsEqual(R, B)
})
Test('Should Resolve.DynamicRef 3', () => {
  const A = { $dynamicAnchor: 'A', type: 'boolean' }
  const R = Schema.Resolve.DynamicRef({}, {}, '', {}, { $dynamicRef: '#A' }, [A])
  Assert.IsEqual(R, A)
})
Test('Should Resolve.DynamicRef 4', () => {
  const A = { $dynamicAnchor: 'A', type: 'boolean' }
  const R = Schema.Resolve.DynamicRef({}, { $defs: [A] }, '', {}, { $dynamicRef: '#A' }, [])
  Assert.IsEqual(R, A)
})
Test('Should Resolve.DynamicRef 5', () => {
  const A = { $dynamicAnchor: 'A', type: 'boolean' }
  const R = Schema.Resolve.DynamicRef({}, { $defs: { A } }, '', {}, { $dynamicRef: '#A' }, [])
  Assert.IsEqual(R, A)
})
// ------------------------------------------------------------------
// Resolve.Resource
// ------------------------------------------------------------------
Test('Should Resolve.Resource 1', () => {
  const A = { $id: 'child.json', type: 'string' }
  const R = Schema.Resolve.Resource({}, { $defs: { A } }, 'https://example.com/', 'child.json')
  Assert.IsEqual(R, A)
})
Test('Should Resolve.Resource 2', () => {
  const A = { $id: 'https://example.com/child.json', type: 'number' }
  const R = Schema.Resolve.Resource({}, { $defs: { A } }, 'https://example.com/', 'https://example.com/child.json')
  Assert.IsEqual(R, A)
})
