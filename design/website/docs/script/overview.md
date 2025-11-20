# Script

TypeScript Scripting Engine

## Overview

TypeBox includes a TypeScript scripting engine that can parse and transform TypeScript types into Json Schema. The engine uses symmetric runtime and type-level parsing, ensuring the Script return type matches the schema generated at runtime. This feature is designed for the upcoming TypeScript 7 native compiler but is supported in TypeScript 5 and later.

### Example

The following uses Script to construct and map Json Schema.

```typescript
import Type from 'typebox'

const T = Type.Script(`{ 
  x: number, 
  y: number, 
  z: number 
}`)                                                 // const T = {
                                                    //   type: 'object',
                                                    //   required: ['x', 'y', 'z'],
                                                    //   properties: {
                                                    //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)                                                 // const S = {
                                                    //   type: 'object',
                                                    //   required: ['x', 'y', 'z'],
                                                    //   properties: {
                                                    //     x: { 
                                                    //       anyOf: [
                                                    //         { type: 'number' }, 
                                                    //         { type: 'null' }
                                                    //       ] 
                                                    //     },
                                                    //     y: { 
                                                    //       anyOf: [
                                                    //         { type: 'number' }, 
                                                    //         { type: 'null' }
                                                    //       ] 
                                                    //     },
                                                    //     z: { 
                                                    //       anyOf: [
                                                    //         { type: 'number' }, 
                                                    //         { type: 'null' }
                                                    //       ] 
                                                    //     },
                                                    //   }
                                                    // }

type S = Type.Static<typeof S>                      // type S = {
                                                    //   x: number | null,
                                                    //   y: number | null,
                                                    //   z: number | null
                                                    // }
```
