# Script

TypeScript DSL Engine

## Overview

TypeBox includes a runtime TypeScript DSL engine that can transform TypeScript syntax into JSON Schema. The engine is implemented at runtime and within the TypeScript type system.

```typescript
// ----------------------------------------------------------
// Script
// ----------------------------------------------------------
const T = Type.Script(`{ 
  x: number, 
  y: string, 
  z: boolean 
}`)

// ----------------------------------------------------------
// Reflect
// ----------------------------------------------------------
T.type                                              // 'object'
T.required                                          // ['x', 'y', 'z']
T.properties                                        // { x: ..., y: ..., z: ... }

// ----------------------------------------------------------
// Computed
// ----------------------------------------------------------
const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)

// ----------------------------------------------------------
// Inference
// ----------------------------------------------------------
type S = Type.Static<typeof S>                      // type S = {
                                                    //   x: number | null,
                                                    //   y: string | null,
                                                    //   z: boolean | null
                                                    // }
```
