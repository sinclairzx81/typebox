# Schema

High Performance JSON Schema Validator

## Overview

TypeBox includes a high performance validation compiler for JSON Schema. The compiler supports both TypeBox and native JSON Schema schematics, and will convert them into optimized runtime validation routines. The compiler is designed to be a lightweight 2020-12 spec compliant alternative to Ajv for high-throughput applications.

### Example

The following uses the Schema submodule to compile a TypeBox type.

```typescript
import Schema from 'typebox/schema'

// -------------------------------------------------------------------------------
// Compile
// -------------------------------------------------------------------------------

const User = Schema.Compile(Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String({ format: 'email' })
}))

// -------------------------------------------------------------------------------
// Parse
// -------------------------------------------------------------------------------

const user = User.Parse({                        // const user: {
  id: '65f1a2b3c4d5e6f7a8b9c0d1',                //   id: string,
  name: 'user',                                  //   name: string,
  email: 'user@domain.com'                       //   email: string
})                                               // } = ...
```