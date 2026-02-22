# Type.ReturnType

Extracts the ReturnType from a Function.

## Example

Example usage is shown below. 

```typescript
const T = Type.Function([Type.String()], Type.Object({
  x: Type.Number()
}))

const S = Type.ReturnType(T)                        // const S: TObject<{
                                                    //   x: TNumber
                                                    // }>
```