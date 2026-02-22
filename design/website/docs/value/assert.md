# Value.Assert

The Assert function throws AssertError if the value does not match the type.

## Example

Example usage is shown below.

```typescript
const T = Type.Number()

Value.Assert(T, 42)                               // OK

Value.Assert(T, 'not a number')                   // throws AssertError
```