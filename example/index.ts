import Schema from 'typebox/schema'

// ------------------------------------------------------------------
// Validate Schema
// ------------------------------------------------------------------
const A = Schema.Parse(Schema.Meta['https://json-schema.org/draft/2020-12/schema'], {
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' },
  }
})
// ------------------------------------------------------------------
// Validate Value
// ------------------------------------------------------------------
const B = Schema.Parse(A, {
  x: 1,
  y: 2,
  z: 3
})