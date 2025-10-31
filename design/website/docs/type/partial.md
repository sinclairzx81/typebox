# Partial

This type is an alias for the `Partial<T>` TypeScript utility type. It makes all properties of an Object optional.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T: TObject<{
  x: Type.Number(),                                 //   x: TNumber,
  y: Type.Number(),                                 //   y: TNumber,
  z: Type.Number()                                  //   z: TNumber
})                                                  // }>

const S = Type.Partial(T)                           // const S: TObject<{
                                                    //   x: TOptional<TNumber>,
                                                    //   y: TOptional<TNumber>,
                                                    //   z: TOptional<TNumber>
                                                    // }>
```
