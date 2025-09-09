# Mutate

The Mutate function mutates a value while preserving interior object and array references.

> ⚠️ The Mutate function is designed to prevent unintended actions in state-aware frameworks such as React. It updates interior non-reference values while retaining object and array references, which can be helpful when optimizing for state-aware systems.

## Example

Example usage is shown below.

```typescript
const Y = { z: 1 }                                  // const Y = { z: 1 }

const X = { y: Y }                                  // const X = { y: { z: 1 } }

const Z = { x: X }                                  // const Z = { x: { y: { z: 1 } } }

// Mutation

Value.Mutate(Z, { x: { y: { z: 2 } } })             // Z = { x: { y: { z: 2 } } }

const A = Z.x.y.z === 2                             // const A = true

const B = Z.x.y === Y                               // const B = true

const C = Z.x === X                                 // const C = true
```