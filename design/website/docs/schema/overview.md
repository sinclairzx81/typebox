# Schema

High Performance JSON Schema Validator

## Overview

TypeBox includes a JSON Schema compiler designed for high-performance JIT validation. It also provides automatic fallback to dynamic interpreted checking for JIT restrictive environments such as Cloudflare Workers. The compiler is designed to be a lightweight, spec compliant alternative to Ajv for high-throughput applications based on the JSON Schema standard.

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