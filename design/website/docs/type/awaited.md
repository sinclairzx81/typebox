# Awaited

The Awaited function unwraps a Promise and returns the interior type.

## Example

Example usage is shown below.

```typescript
const T = Type.Promise(Type.String())

const S = Type.Awaited(T)                           // const S: TString
```


