# Type.Conditional

Creates a conditional type expression.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below.

```typescript
const L = Type.Literal(1)
const R = Type.Number()

const T = Type.Conditional(L, R,                    // const T: TLiteral<true>
  Type.Literal(true),
  Type.Literal(false)
)
```
