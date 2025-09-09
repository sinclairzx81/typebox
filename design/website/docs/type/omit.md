# Omit

Omits keys from the given Object type.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const S = Type.Omit(T, Type.Union([                 // const S: TObject<{
  Type.Literal('z')                                 //   x: TNumber,
]))                                                 //   y: TNumber
                                                    // }>
```