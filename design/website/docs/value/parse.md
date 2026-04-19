# Value.Parse

The Parse function validates and returns a value that conforms to a given type. If the value does not satisfy the type, a parse error is thrown.

## Example

Example usage is shown below.

```typescript
const R = Value.Parse(Type.String(), 'hello')      // const R: string = "hello"

const E = Value.Parse(Type.String(), 12345)        // throws ParseError 
```