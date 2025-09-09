# Partial

Makes all properties of an Object optional.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

const S = Type.Partial(T)                           // const S: TObject<{
                                                    //   x: TOptional<TNumber>,
                                                    //   y: TOptional<TNumber>,
                                                    //   z: TOptional<TNumber>
                                                    // }>
```
