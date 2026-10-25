# Module

High Performance Validation Modules

## Overview

TypeBox includes an ESM module compiler that builds standalone validation modules from Types and JSON Schema definitions. Each module is self-contained and type annotated, including only the code required to validate and reflect its types at runtime. Modules provide an AOT alternative to JIT, where statically built modules can be deployed to JIT-restricted environments while ensuring the highest possible performance.

The module compiler is available as an optional submodule.

```typescript
import Module from 'typebox/module'
```

### Build

The following builds three types into a standalone validation module.

```typescript
import Module from 'typebox/module'

const Math = Type.Script(`
  type Vector4 = { x: number, y: number, z: number, w: number }
  type Vector3 = { x: number, y: number, z: number }
  type Vector2 = { x: number, y: number }
`)

const Code = Module.Build(Math)                    // TypeScript String

SaveToDisk('./math.ts', Code)                      // Everything
                                                   // bundled:   2.74 KB
                                                   // minified:  1.50 KB
                                                   // gzipped:   0.48 KB
```

### Import

Module types can be imported in the following way.

```typescript
// index.ts

import { Vector3 } from './math.ts'                // Vector3 only
                                                   // bundled:   1.49 KB
                                                   // minified:  0.88 KB
                                                   // gzipped:   0.43 KB

// Static

const input: Vector3 = { x: 1, y: 0, z: 0 }        // Vector3 is also a static type

// Check

const valid = Vector3.Check(input)                 // const valid: boolean

// Parse

const result = Vector3.Parse(input)                // const result: {
                                                   //   x: number
                                                   //   y: number
                                                   //   z: number
                                                   // } = { ... }

// Reflect

const schema = Vector3.Schema()                    // const schema: {
                                                   //   type: 'object',
                                                   //   required: ['x', 'y', 'z'],
                                                   //   properties: {
                                                   //     x: { type: 'number' },
                                                   //     y: { type: 'number' },
                                                   //     z: { type: 'number' }
                                                   //   }
                                                   // }
```