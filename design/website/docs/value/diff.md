# Diff

The Diff function computes a sequence of Edit commands to transform the Left value into the Right value. The resulting Edit commands can be passed to Patch, which executes them in sequence.

This function is used to synchronize large data structures over a network by transmitting only the Edit commands representing state changes. Applications are expected to maintain both the old and new states. The Clone function is commonly used to copy the old state into a mutable new state, and Hash can be used to compute a local hash of the state. This hash can be transmitted along with the Edit commands to verify that the applied edits produced the expected current value.

## Example

Example usage is shown below.

```typescript
const L = { x: 1, y: 2, z: 3 }                       // Left
const R = { y: 4, z: 5, w: 6 }                       // Right

const E = Value.Diff(L, R)                           // const E = [
                                                     //   { type: 'update', path: '/y', value: 4 },
                                                     //   { type: 'update', path: '/z', value: 5 },
                                                     //   { type: 'insert', path: '/w', value: 6 },
                                                     //   { type: 'delete', path: '/x' }
                                                     // ]
```