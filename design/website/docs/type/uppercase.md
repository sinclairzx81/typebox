# Uppercase

The Uppercase function will uppercase string literals.

## Example

Example usage is shown below.

```typescript
const T = Type.Literal('hello')

const S = Type.Uppercase(T)                         // const S: TLiteral<'HELLO'>
```