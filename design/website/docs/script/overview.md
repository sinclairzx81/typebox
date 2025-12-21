# Script

TypeScript Scripting Engine

## Overview

TypeBox is a runtime TypeScript DSL engine that can create, transform, and compute Json Schema using native TypeScript syntax. The engine is implemented symmetrically at runtime and within the TypeScript type system, and is intended for use with the TypeScript 7 native compiler and above.


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
