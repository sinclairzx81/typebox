## Type.Options

Options can be passed on the last argument of any given type.

## Example

Example usage is shown below.

```typescript
const T = Type.Number({                             // const T = {
  minimum: 10,                                      //   type: 'number',
  maximum: 100                                      //   minimum: 10,
})                                                  //   maximum: 100
                                                    // }

                                                    // const T: TNumber
```