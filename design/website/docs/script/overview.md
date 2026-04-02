# Script

TypeScript Syntax Engine

## Overview

TypeBox can transform TypeScript definitions into JSON Schema. The Script function provides an optional programmatic syntax to rapidly convert type definitions into JSON Schema, or serve more generally as an alternative to Type.* builders. The Script function is designed to handle a wide array of complex TypeScript type-level expressions.

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
