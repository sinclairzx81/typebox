# Clean

The Clean function will remove excess properties or elements from a value. 

> ⚠️ The Clean function may return invalid data if the provided value is itself invalid. This function does not perform any checks on the value to ensure the data is correct. The function returns `unknown` and therefore results should be checked before use.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({ 
  x: Type.Number(), 
  y: Type.Number() 
})


const R = Value.Clean(T, { x: 1, y: 2, z: 3 })        // const R = { x: 1, y: 2 }

```

```typescript
const T = Type.Tuple([ 
  Type.Number(), 
  Type.Number() 
])

const R = Value.Clean(T, [1, 2, 3])                   // const R = [1, 2]
```