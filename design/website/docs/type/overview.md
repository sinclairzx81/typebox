# Type

JSON Schema Type Builder with Static Type Resolution for TypeScript

## Overview

TypeBox types are JSON Schema fragments that can compose into more complex types. The library offers a set of types used to construct JSON Schema compliant schematics as well as a set of extended types used to model constructs native to the JavaScript language. The schematics produced by TypeBox can be passed directly to any JSON Schema compliant validator.

## Example

The following creates a User type and infers with Static.

```typescript
import Type from 'typebox'

// -------------------------------------------------------------------------------
// Type
// -------------------------------------------------------------------------------

const User = Type.Object({                       // const User = {
  id: Type.String(),                             //   type: 'object',
  name: Type.String(),                           //   properties: {
  email: Type.String({ format: 'email' })        //     id: { type: 'string' },
})                                               //     name: { type: 'string' },
                                                 //     email: { 
                                                 //       type: 'string', 
                                                 //       format: 'email' 
                                                 //     }
                                                 //   }
                                                 //   required: [
                                                 //     'id', 
                                                 //     'name', 
                                                 //     'email'
                                                 //   ]
                                                 // }

// -------------------------------------------------------------------------------
// Static
// -------------------------------------------------------------------------------

type User = Type.Static<typeof User>              // type User = {
                                                  //   id: string,
                                                  //   name: string,
                                                  //   email: string
                                                  // }
```

Options and constraints can be passed on the last argument of any given type.

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
```