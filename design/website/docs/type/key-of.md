# Type.KeyOf

Extracts Keys from an Object or Tuple.

## Example

Example usage is shown below. 

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const S = Type.KeyOf(T)                             // const S: TUnion<[
                                                    //  TLiteral<'x'>,
                                                    //  TLiteral<'y'>,
                                                    //  TLiteral<'z'>
                                                    // ]>
```