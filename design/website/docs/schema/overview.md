# Schema

High Performance JSON Schema Validator

## Overview

TypeBox includes a high-performance JSON Schema compiler supporting drafts 3 to 2020-12. It is written to be a lightweight alternative to Ajv with improved compilation and validation performance, and automatic fallback to dynamic checking in JIT-restricted environments such as Cloudflare Workers.

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