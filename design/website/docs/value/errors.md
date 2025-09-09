# Errors

The Errors function returns an array of validation errors for the specified value. If the value contains no errors, an empty array is returned. This function should only be invoked after a failed Check.

> ⚠️ For performance reasons, this function should be called only when a value fails a Check. The function performs an exhaustive recheck of the entire value and returns any errors encountered. Exhaustive validation can be costly for large values, so applications should carefully consider the performance impact of generating errors. For performance-sensitive scenarios, it is recommended to generate errors only in debugging or development environments.

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