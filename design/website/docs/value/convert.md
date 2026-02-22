# Value.Convert

The Convert function will convert values to match the given type if a reasonable converion is possible. If no conversion is possible, the original value is returned unchanged.

> ⚠️ The Convert function may return invalid data if the provided value is invalid. This function does not perform any checks on the value to ensure the data is correct. This function returns `unknown` and therefore results should be checked before use.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({ 
  x: Type.Number() 
})

// ...

const A = Value.Convert(T, { x: '3.14' })           // const A = { x: 3.14 }

const B = Value.Convert(T, { x: 'not a number' })   // const B = { x: 'not a number' }
```

