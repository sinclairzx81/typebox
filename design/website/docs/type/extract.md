# Type.Extract

The Extract function will extract types from Left that extend Right.

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

const S = Type.Extract(L, R)                        // const S: TUnion<[
                                                    //   TLiteral<'hello'>,
                                                    //   TLiteral<'world'>
                                                    // ]>
```