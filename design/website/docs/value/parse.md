# Parse

The Parse function attempts to parse a value and throws an error if the value is invalid. This function is similar to Decode, but it does not execute Decode callbacks. Parse is considered a faster version of Decode, as operations that transform values are skipped when the value already matches the expected type.

> The Parse function first checks a value against the provided type and returns immediately if it matches. If the value does not match, it is processed through a sequence of Clone, Clean, Convert, and Default operations, and then re-checked. If the value remains invalid, a ParseError error is thrown.

## Example

Example usage is shown below.

```typescript
const R = Value.Parse(Type.String(), 'hello')      // const R: string = "hello"

const E = Value.Parse(Type.String(), [{ x: 1 }])   // throws ParseError 
```