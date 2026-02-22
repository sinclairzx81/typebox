# Type.Pick

Picks property keys from the given Object type.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const S = Type.Pick(T, Type.Union([                 // const S: TObject<{
  Type.Literal('x')                                 //   x: TNumber,
  Type.Literal('y')                                 //   y: TNumber
]))                                                 // }>
```