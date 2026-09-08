# Schema.Meta

JSON Schema is JSON like any other, and can be validated the same way. TypeBox includes meta schemas for the JSON Schema drafts it supports, letting you validate a schema against a specific draft version.

> ⚠️ TypeBox only includes meta schemas for published JSON Schema versions it tests against. Auxiliary schemas, such as OpenAPI or OpenRPC, can be passed to TypeBox but must be sourced separately.

### Meta Schema Definitions

TypeBox provides inline definitions for the following JSON Schema draft meta schemas, also available at these URLs:

- [Draft 2020-12](https://json-schema.org/draft/2020-12/schema)
- [Draft 2019-09](https://json-schema.org/draft/2019-09/schema)
- [Draft 7](http://json-schema.org/draft-07/schema#)
- [Draft 6](http://json-schema.org/draft-06/schema#)
- [Draft 4](http://json-schema.org/draft-04/schema#)
- [Draft 3](http://json-schema.org/draft-03/schema#)

### Usage

The example below parses a schema as Draft 2020-12, then validates a value against it. The meta schema is selected by its `$schema` identifier.

```typescript
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
```