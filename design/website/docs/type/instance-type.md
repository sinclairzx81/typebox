# InstanceType

Extracts the InstanceType from a Constructor type.

## Example

Example usage is shown below. 

```typescript
const T = Type.Constructor([Type.String()], Type.Object({
  x: Type.Number()
}))

const S = Type.InstanceType(T)                      // const S: TObject<{
                                                    //   x: TNumber
                                                    // }>
```