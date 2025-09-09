# Script

A TypeScript Engine for JavaScript

## Overview

TypeBox is a runtime type system that uses Json Schema as an AST for runtime type representation. The Script function provides a syntactic frontend to the type system and allows Json Schema to be created using native TypeScript syntax. TypeBox provides full static and runtime type safety for string-encoded types.

### Example

The following uses the Script function to create and transform Json Schema types.

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

// Mapped Type

const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)                                                 // const S: TObject<{
                                                    //   x: TUnion<[TNumber, TNull]>,
                                                    //   y: TUnion<[TNumber, TNull]>,
                                                    //   z: TUnion<[TNumber, TNull]>
                                                    // }>

type S = Static<typeof S>                           // type S = {
                                                    //   x: number | null,
                                                    //   y: number | null,
                                                    //   z: number | null
                                                    // }
```
