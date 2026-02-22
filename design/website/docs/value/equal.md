# Value.Equal

The Equal function performs a structural value comparison against JavaScript values.

## Example

Example usage is shown below.

```typescript
const R = Value.Equal(                               // const R = true
  { x: 1, y: 2, z: 3 },
  { x: 1, y: 2, z: 3 }
)
```