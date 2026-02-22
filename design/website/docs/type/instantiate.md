# Type.Instantiate

The Instantiate function will instantiate interior references embedded within a type. This function accepts a context object as the first argument which is used to source referenced types.

## Example

The following instantiates embedded Ref types.

```typescript
const X = Type.Literal(1)
const Y = Type.Literal(2)
const Z = Type.Literal(3)

const T = Type.Object({
  x: Type.Ref('X'),
  y: Type.Ref('Y'),
  z: Type.Ref('Z'),
})

const S = Type.Instantiate({ X, Y, Z }, T)          // const S: TObject<{
                                                    //   x: TLiteral<1>,
                                                    //   y: TLiteral<2>,
                                                    //   z: TLiteral<3>
                                                    // }>
```