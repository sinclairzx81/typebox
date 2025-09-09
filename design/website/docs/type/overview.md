# Type

A Json Schema Type Builder with Static Inference for TypeScript

## Overview

TypeBox provides many functions to build Json Schema. Each function returns a small Json Schema fragment which maps to a corresponding TypeScript type. TypeBox uses function composition to compose schema fragments into higher order types. TypeBox provides a set of types to model Json Schema schematics. It also offers a set of extended schematics to model constructs native to TypeScript and JavaScript.

## Example

The following creates Json Schema and infers with Static.

```typescript
import Type, { type Static } from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```