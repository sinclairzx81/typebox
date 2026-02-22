# Schema.Compile

The `Compile(...)` function compiles JSON Schema into a high performance Validator. The Validator contains optimized methods for `Check(...)`, `Errors(...)` and `Parse(...)`.

## Example

```typescript
import Schema from 'typebox/schema'

// ------------------------------------------------------------------
// Schema + Compile
// ------------------------------------------------------------------

const C = Schema.Compile({ 
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
})

// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------

const R = C.Check({ x: 1, y: 2, z: 3 })             // const R: value is {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...

// ------------------------------------------------------------------
// Parse
// ------------------------------------------------------------------

const S = C.Parse({ x: 1, y: 2, z: 3 })             // const S: {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------

const E = C.Errors(T, { x: null })                  // const E = [
                                                    //   false,
                                                    //   [
                                                    //     {
                                                    //       keyword: "required",
                                                    //       schemaPath: "#",
                                                    //       instancePath: "",
                                                    //       params: { requiredProperties: [ "y", "z" ] },
                                                    //       message: "must have required properties y, z"
                                                    //     },
                                                    //     {
                                                    //       keyword: "type",
                                                    //       schemaPath: "#/properties/x",
                                                    //       instancePath: "/x",
                                                    //       params: { type: "number" },
                                                    //       message: "must be number"
                                                    //     }
                                                    //   ]
                                                    // ]
```
