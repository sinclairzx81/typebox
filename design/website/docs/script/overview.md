# Script

A TypeScript Engine for JavaScript

## Overview

TypeBox is a type system designed to use Json Schema as an AST for runtime type representation. The Script function provides a full syntactic frontend to the type system and enables Json Schema to be constructed using native TypeScript syntax. TypeBox provides full static and runtime type safety for string-encoded types.

### Example

The following uses Script to construct and map Json Schema.

```typescript
import Type, { type Static } from 'typebox'

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

type S = Static<typeof S>                           // type S = {
                                                    //   x: number | null,
                                                    //   y: number | null,
                                                    //   z: number | null
                                                    // }
```
