# Schema.Parse

The `Parse(...)` function returns the value if match, otherwise throw.

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
// Parse
// ------------------------------------------------------------------
const R = Schema.Parse(T, { x: 1, y: 2, z: 3 })     // const R: {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...
```
