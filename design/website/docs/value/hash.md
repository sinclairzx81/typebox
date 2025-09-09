# Hash

The Hash function creates a structural hash of a JavaScript value. It returns a padded 64-bit hexadecimal string. Internally, this function computes an accumulated `fnv1a-64` hash across all properties, elements, and embedded values of the input. It is intended to generate fast computed hash codes for arbitrary JavaScript data structures.

⚠️ Applications should not rely on this function to store persistent hashes. The hashing algorithm is specific to TypeBox and is not based on any formal specification. While the algorithm is generally considered stable, it may be replaced with a JavaScript hashing specification should one emerge. This function should only be used to compare two values.

## Example

Example usage is shown below.

```typescript
const A = Value.Hash({ x: 1, y: 2, z: 3 })           // const A = '0834a0916e3e4db0'

const B = Value.Hash({ x: 1, y: 4, z: 3 })           // const B = '279c16b78fba6600'
```