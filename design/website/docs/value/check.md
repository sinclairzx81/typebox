# Check

The Check function returns true if the value matches the type. 

## Example

Example usage is shown below.

```typescript
const T = Type.Number()

const A = Value.Check(T, 42)                        // const A = true

const B = Value.Check(T, 'not-a-number')            // const B = false
```