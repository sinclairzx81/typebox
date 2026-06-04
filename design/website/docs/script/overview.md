# Script

Runtime TypeScript Engine For JSON Schema

## Overview

TypeBox includes a micro DSL for composing JSON Schema with TypeScript syntax. The DSL offers a full syntactic frontend to Type.* and supports many advanced type-level constructs such as Conditional, Mapped, Indexed, Infer, Generics, Distributed types and more. This feature is implemented symmetrically at runtime and statically via TypeScript Template Literal types.

### Example

The following uses Script to parse a TypeScript definition module into JSON Schema.

```typescript
import Type from 'typebox'

// -------------------------------------------------------------------------------
// Script
// -------------------------------------------------------------------------------

const { User, UserUpdate } = Type.Script(`

  interface Entity {
    id: string
  }

  interface User extends Entity { 
    name: string, 
    email: string 
  }

  type UserUpdate = Evaluate<
    Pick<User, keyof Entity> & 
    Partial<Omit<User, keyof Entity>>
  >

`)

// -------------------------------------------------------------------------------
// Reflect
// -------------------------------------------------------------------------------

console.log(User)                                // {
                                                 //   type: 'object',
                                                 //   properties: {
                                                 //     id: { type: 'string' },
                                                 //     name: { type: 'string' },
                                                 //     email: { type: 'string' }
                                                 //   },
                                                 //   required: [
                                                 //     'id', 
                                                 //     'name', 
                                                 //     'email'
                                                 //   ]
                                                 // }

console.log(UserUpdate)                          // {
                                                 //   type: 'object',
                                                 //   properties: {
                                                 //     id: { type: 'string' },
                                                 //     name: { type: 'string' },
                                                 //     email: { type: 'string' }
                                                 //   },
                                                 //   required: ['id']
                                                 // }

// -------------------------------------------------------------------------------
// Static
// -------------------------------------------------------------------------------

type User = Type.Static<typeof User>              // type User = {
                                                  //   id: string,
                                                  //   name: string,
                                                  //   email: string
                                                  // }

type UserUpdate = Type.Static<typeof UserUpdate>  // type UserUpdate = {
                                                  //   id: string,
                                                  //   name?: string,
                                                  //   email?: string
                                                  // }

```
