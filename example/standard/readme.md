# Standard Schema

A unified adapter that compiles TypeScript definitions, TypeBox types, or JSON Schema into a [Standard Schema V1](https://github.com/standard-schema/standard-schema) compatible interface.

## Usage

The adapter is a single `StandardSchema` function that will accept any of the three supported input formats and return a Standard Schema V1 interface. TypeScript inference is supported for all given inputs.


```typescript
import StandardSchema from './standard/index.ts' // this module
import Type from 'typebox'

// ------------------------------------------------------------------
// Script
// ------------------------------------------------------------------

const VectorA = StandardSchema(`{
  x: number
  y: number
  z: number
}`)


// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------

const VectorB = StandardSchema(Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number(),
}))

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------

const VectorC = StandardSchema({
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
})

// ------------------------------------------------------------------
// Validate
// ------------------------------------------------------------------

const Result = VectorA['~standard'].validate({      // const Result: StandardSchemaV1.Result<{
  x: 1,                                             //   x: number;
  y: 2,                                             //   y: number;
  z: 3                                              //   z: number;
})                                                  // }> | Promise<StandardSchemaV1.Result<{
                                                    //   x: number;
                                                    //   y: number;
                                                    //   z: number;
                                                    // }>>
```

