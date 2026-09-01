# Value.Errors

The Errors(...) function returns an array of gathered validation errors up to the configured `maxErrors` limit. If the value contains no errors, an empty array is returned.

> ⚠️ For performance, this function should only be called after a failed Check. The function performs an exhaustive check up to the `maxErrors` setting (the default is `8`). For additional performance, consider reducing `maxErrors` to `1`, which will terminate gathering on the first error.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({ 
  x: Type.Number(), 
  y: Type.Number() 
})

const value = { x: 'not-a-number' }

const errors = Value.Errors(T, value)               // const errors = [{
                                                    //   keyword: 'required',     
                                                    //   schemaPath: '#/required',
                                                    //   instancePath: '',
                                                    //   params: { requiredProperties: [ 'y' ] },
                                                    //   message: 'must have required properties y'
                                                    // }, {
                                                    //   keyword: 'type',
                                                    //   schemaPath: '#/properties/x/type',
                                                    //   instancePath: '/x',
                                                    //   params: { type: 'number' },
                                                    //   message: 'must be number'
                                                    // }]

// ------------------------------------------------------------------
//
// Optional
//
// Use Value.Pointer.Get to access invalid values via `instancePath` 
//
// ------------------------------------------------------------------

const errorsWithValue = errors.map(error => {
  return { ...error, 
    value: Value.Pointer.Get(value, error.instancePath) 
  }
})
```