# Schema.Errors

The `Errors(...)` function returns a validation result containing a boolean success value, and an array of validation errors.

## Example

```typescript
import Schema from 'typebox/schema'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
const T = { 
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
} as const

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------

// where E is: [success: boolean, errors: TLocalizedValidationError[]]

const E = Schema.Errors(T, { x: null })             // const E = [
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

console.log(errors)
```