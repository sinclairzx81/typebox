# Schema

Native JSON Schema Validation and Inference

## Overview

The Schema submodule is a low level JSON Schema spec compliant validation system that supports Drafts 3 through to 2020-12. This validation system is decoupled from both Type.* and Value.* submodules and is designed to be an ultra lightweight, high performance alternative to Ajv for compiling and validating with native JSON Schema.

```typescript
import Schema from 'typebox/schema'
```

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