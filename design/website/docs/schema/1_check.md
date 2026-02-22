# Schema.Check

The `Check(...)` function returns true if the value matches the schema.

## Example

```typescript
import Schema from 'typebox/schema'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------

const T = { 
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
} as const

// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------

const R = Schema.Check(T, { x: 1, y: 2, z: 3 })     // const R: value is {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```
