# Type

Json Schema Type Builder with Static Type Resolution for TypeScript

## Overview

TypeBox includes many functions to create Json Schema types. Each function returns a small Json Schema fragment that corresponds to a TypeScript type. TypeBox uses function composition to combine schema fragments into more complex types. It provides a set of functions that are used to model Json Schema schematics as well as a set of functions that model constructs native to JavaScript and TypeScript.

## Example

The following creates a Json Schema type and infers with Static.

```typescript
import Type from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Type.Static<typeof T>                      // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```

Constraints and metadata can be passed on the last argument of any given type.

```typescript
const T = Type.Number({                            // const T = {
  minimum: 0,                                      //   type: 'number',
  maximum: 100                                     //   minimum: 0,
})                                                 //   maximum: 100
                                                   // }

const S = Type.String({                            // const S = {
  format: 'email'                                  //   type: 'string',
})                                                 //   format: 'email'
                                                   // }

const M = Type.Object({                            // const M = {
  id: Type.String(),                               //   type: 'object',
  message: Type.String()                           //   required: ['id', 'message'],
}, {                                               //   properties: {
  description: 'A protocol message'                //     id: { type: 'string' },
})                                                 //     message: { type: 'string' }
                                                   //   },
                                                   //   description: 'A protocol message'
                                                   // }
``` 