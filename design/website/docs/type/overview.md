# Type

JSON Schema Type Builder with Static Type Resolution for TypeScript

## Overview

TypeBox types are JSON Schema fragments that compose into more complex types. The library provides a core set of types for constructing JSON Schema compliant schematics, alongside extended types designed to model constructs native to JavaScript and TypeScript. The JSON Schema schematics produced by TypeBox can be passed directly to any compliant validator.

### Example

The following creates a User type and infers with Static.

```typescript
import Type from 'typebox'

const User = Type.Object({                       // const User = {
  id: Type.String(),                             //   type: 'object',
  name: Type.String(),                           //   required: [
  email: Type.String({ format: 'email' })        //     'id', 
})                                               //     'name', 
                                                 //     'email'
                                                 //   ],
                                                 //   properties: {
                                                 //     id: { type: 'string' },
                                                 //     name: { type: 'string' },
                                                 //     email: { 
                                                 //       type: 'string', 
                                                 //       format: 'email' 
                                                 //     }
                                                 //   }
                                                 // }

type User = Type.Static<typeof User>              // type User = {
                                                  //   id: string,
                                                  //   name: string,
                                                  //   email: string
                                                  // }
```