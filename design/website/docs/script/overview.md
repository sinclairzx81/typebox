# Script

TypeScript Syntax Engine

## Overview

The TypeBox Script function is a micro DSL for constructing JSON Schema from TypeScript syntax. It offers a full syntactic frontend to Type.* with broad support for type-level expressions including Conditional, Mapped, Infer, Generic, Distributive types and more. This feature is implemented symmetrically at both runtime and in the type system.

### Example

The following uses the Script to parse interfaces into JSON Schema.

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
