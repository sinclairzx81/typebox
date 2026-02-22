# Type.Parameters

The Parameters function will extract Parameters from a Function type.

## Example

Example usage is shown below.

```typescript
const T = Type.Function([Type.String(), Type.Number()], Type.Object({}))

const S = Type.Parameters(T)                        // const S: TTuple<[
                                                    //   TString,
                                                    //   TNumber
                                                    // ]>
```