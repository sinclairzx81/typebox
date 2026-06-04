# Schema

High Performance Validation for JSON Schema 

## Overview

TypeBox includes a high-performance JSON Schema compiler with support for drafts 3 through to 2020-12. It is designed to be a lightweight industry-grade alternative to Ajv with improved compilation and validation performance.

The compiler is standalone and can be paired with either TypeBox types, native JSON Schema or used with other schema producing libraries. It is designed specifically for high throughput validation via JIT compilation, but also supports automatic fallback to dynamic validation in JIT-restricted environments such as Cloudflare Workers.


### Example

The following uses the Schema submodule to compile and validate with JSON Schema.

```typescript
// Compile JSON Schema

const User = Schema.Compile({
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  }
})

// Parse

const result = User.Parse({                              // type result: {
  id: '65f1a2b3c4d5e6f7a8b9c0d1',                        //   id: string
  name: 'user',                                          //   name: string
  email: 'user@domain.com'                               //   email: string
})                                                       // }
```

TypeBox types are JSON Schema

```typescript
const User = Schema.Compile(Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String({ format: 'email' })
}))
```

TypeBox Script types are also JSON Schema

```typescript
const User = Schema.Compile(Type.Script(`{
  id: string
  name: string
  email: string with { format: 'email' }
}`))
```