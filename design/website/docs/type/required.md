# Type.Required

Makes all properties of an Object required.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T = {
  x: Type.Optional(Type.Number()),                  //   type: 'object',
  y: Type.Optional(Type.Number()),                  //   properties: {
  z: Type.Optional(Type.Number())                   //     x: { type: 'number' },
})                                                  //     y: { type: 'number' }, 
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

const S = Type.Required(T)                          // const S: TObject<{
                                                    //   x: TNumber,
                                                    //   y: TNumber,
                                                    //   z: TNumber
                                                    // }>
```
