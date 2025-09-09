# Uncapitalize

The Uncapitalize function will uncapitalize string literals.

## Example

Example usage is shown below.

```typescript
const T = Type.Literal('HELLO')

const S = Type.Uncapitalize(T)                      // const S: TLiteral<'hELLO'>
```