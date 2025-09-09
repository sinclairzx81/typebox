# Lowercase

The Lowercase function will lowercase string literals.

## Example

Example usage is shown below.

```typescript
const T = Type.Literal('HELLO')

const S = Type.Lowercase(T)                         // const S: TLiteral<'hello'>
```