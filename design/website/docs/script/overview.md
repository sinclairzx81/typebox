# Script

TypeScript Scripting Engine

## Overview

TypeBox includes a TypeScript scripting engine able to parse TypeScript types directly into Json Schema. The engine uses symmetric runtime and type-level parsing and returns typed safe schematics from TypeScript types (including computed types). The engine is designed for TypeScript 7 native compiler but is supported in TypeScript 5 and above.

```typescript
// Scripted Type

const T = Type.Script(`{ 
  x: number, 
  y: string, 
  z: boolean 
}`)                                                 // const T: TObject<{
                                                    //   x: TNumber,
                                                    //   y: TString,
                                                    //   z: TBoolean
                                                    // }>

// Json Schema Introspection

T.type                                              // 'object'
T.required                                          // ['x', 'y', 'z']
T.properties                                        // { x: ..., y: ..., z: ... }

// Scripted Type (Computed)

const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)                                                 // const S: TObject<{
                                                    //   x: TUnion<[TNumber, TNull]>,
                                                    //   y: TUnion<[TString, TNull]>,
                                                    //   z: TUnion<[TBoolean, TNull]>
                                                    // }>

// Standard Inference

type S = Type.Static<typeof S>                      // type S = {
                                                    //   x: number | null,
                                                    //   y: string | null,
                                                    //   z: boolean | null
                                                    // }
```
