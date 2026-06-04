# Schema

High Performance Validation for JSON Schema 

## Overview

TypeBox includes a high-performance JIT compiler that supports JSON Schema Draft 3 through to 2020-12. It is designed to be a lightweight industry-grade alternative to Ajv and offers improved compilation and validation performance. It also provides automatic fallback to dynamic validation in JIT restricted environments such as Cloudflare Workers.

The compiler is available via optional sub module import.

```typescript
import Schema from 'typebox/schema'
```

### Compile

The compiler accepts JSON Schema and returns Validator instances.

```typescript
const Vector = Schema.Compile(Type.Object({       // const Vector: Validator<TObject<{
  x: Type.Number(),                                //   x: TNumber
  y: Type.Number(),                                //   y: TNumber
  z: Type.Number()                                 //   z: TNumber
}))                                                // }>>
```
With JSON Schema
```typescript
const Vector = Schema.Compile({                    // const Vector: Validator<{
  type: 'object',                                  //   type: "object";
  required: ['x', 'y', 'z'],                       //   required: ["x", "y", "z"];
  properties: {                                    //   properties: { ... };
    x: { type: 'number' },                         // }, { ... }>
    y: { type: 'number' },
    z: { type: 'number' }
  }
})
```

### Validate

Validator instances provide functions to Check and Parse values.

```typescript
const Vector = Schema.Compile(Type.Script(`{
  x: number
  y: number
  z: number
}`))

const valid = Vector.Check({                       // const valid: boolean
  x: 1,
  y: 0,
  z: 0
}) 

const value = Vector.Parse({                       // const value: {      
  x: 1,                                            //   x: number
  y: 0,                                            //   y: number
  z: 0                                             //   z: number
})                                                 // }
```