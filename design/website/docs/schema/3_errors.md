# Schema.Errors

The Errors(...) function returns an array of gathered validation errors up to the configured `maxErrors` limit. If the value contains no errors, an empty array is returned.

> ⚠️ For performance, this function should only be called after a failed Check. The function performs an exhaustive check up to the `maxErrors` setting (the default is `8`). For additional performance, consider reducing `maxErrors` to `1`, which will terminate gathering on the first error.

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