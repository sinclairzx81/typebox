# Value.Patch

The Patch function applies a sequence of Edit commands to a value.


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

// Patch Left with Edits

const A = Value.Patch(L, E)                          // const A = { y: 4, z: 5, w: 6 }
```