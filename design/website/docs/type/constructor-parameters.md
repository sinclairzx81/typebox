# ConstructorParameters

The ConstructorParameters function will extract Parameters from a Constructor type.

## Example

Example usage is shown below.

```typescript
const T = Type.Constructor([Type.String(), Type.Number()], Type.Object({}))

const S = Type.ConstructorParameters(T)             // const S: TTuple<[
                                                    //   TString,
                                                    //   TNumber
                                                    // ]>
```