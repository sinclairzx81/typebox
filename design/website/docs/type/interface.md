# Type.Interface

The Interface function creates an Object with Heritage.

## Example

Example usage is shown below. 

```typescript
const A = Type.Interface([], {                      // const A: TObject<{
  a: Type.Number()                                  //   a: TNumber
})                                                  // }>


const B = Type.Interface([A], {                     // const B: TObject<{
  b: Type.Number()                                  //   a: TNumber,
})                                                  //   b: TNumber
                                                    // }

```