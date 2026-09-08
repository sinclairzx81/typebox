# Schema

High Performance JSON Schema Compiler

## Overview

TypeBox includes a high-performance JSON Schema JIT compiler that supports Draft 3 through to 2020-12. The compiler is designed to be a lightweight industry-grade alternative to Ajv and offers improved compilation and validation performance. It also offers automatic fallback to dynamic validation in JIT restricted environments such as Cloudflare Workers.

The compiler is available via optional sub module import.

```typescript
import Schema from 'typebox/schema'
```

### Compile

The compiler accepts both TypeBox types and plain JSON Schema objects. The Compile function will return a new Validator instance which can be used to check and parse values. The example below compiles a Script definition into a validator.

```typescript
// Compile

const Vector = Schema.Compile(Type.Script(`{
  x: number
  y: number
  z: number
}`))

// Check

const valid = Vector.Check({ x: 1, y: 0, z: 0 })   // const valid: boolean

// Parse

const result = Vector.Parse({ x: 1, y: 0, z: 0 })  // const result: {      
                                                   //   x: number
                                                   //   y: number
                                                   //   z: number
                                                   // }
```