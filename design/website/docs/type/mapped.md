# Type.Mapped

Applies a Mapped operation to a type.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

                                                    // type S = { 
                                                    //   [K in keyof T]: T[K] | null 
                                                    // }

const S = Type.Mapped(                              // const S: TObject<{
  Type.Identifier('K'),                             //   x: TUnion<[TNumber, TNull]>,
  Type.KeyOf(T),                                    //   y: TUnion<[TNumber, TNull]>,
  Type.Ref('K'),                                    //   z: TUnion<[TNumber, TNull]>,
  Type.Union([                                      // }>
    Type.Index(T, Type.Ref('K')),
    Type.Null()
  ])
)
```