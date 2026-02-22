# Schema

Native JSON Schema Validation and Inference

## Overview

```typescript
import Schema from 'typebox/schema'
```

The Value submodule is developed over a more low level JSON Schema spec compliant validation system that supports Drafts 3 through to 2020-12. This validation system is entirely decoupled from both Type and Value submodules and is designed to be a ultra lightweight, high performance alternative to Ajv.

### Example

The following uses the Schema submodule to compile and parse from JSON Schema.

```typescript
// ----------------------------------------------------------
// Compile
// ----------------------------------------------------------

const C = Schema.Compile({
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
})

// ----------------------------------------------------------
// Parse
// ----------------------------------------------------------

const R = C.Parse({  x: 0, y: 0, z: 0 })            // const R: {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...
```