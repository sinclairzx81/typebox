# Value.Clone

The Clone function will clone a value. This function is similar to `structuredClone()` but also clones JavaScript collections such as `Map`, `Set` and `TypeArray`.

## Example

Example usage is shown below.

```typescript
const A = { x: 1, y: 2, z: 3 }

const B = Value.Clone(A)                            // const B = { x: 1, y: 2, z: 3 }
```