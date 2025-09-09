# Exclude

The Exclude function will exclude types from Left that extend Right.

## Example

Example usage is shown below.

```typescript
const L = Type.Union([
  Type.Literal('hello'),
  Type.Literal('world'),
  Type.Literal(1),
  Type.Literal(2)
])
const R = Type.String()

const S = Type.Exclude(L, R)                        // const S: TUnion<[
                                                    //   TLiteral<1>,
                                                    //   TLiteral<2>
                                                    // ]>
```