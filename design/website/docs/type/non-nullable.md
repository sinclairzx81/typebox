# Type.NonNullable

The NonNullable function will discard variants of Undefined and Null from a Union type.

## Example

Example usage is shown below.

```typescript
const T = Type.Union([Type.String(), Type.Undefined(), Type.Null()])

const S = Type.NonNullable(T)                       // const S: TString
```