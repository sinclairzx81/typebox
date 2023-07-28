# Transform

This example includes an experimental type Transform implementation which applies codec functions to a type for deferred encode decode. Transform is indended to be used with the Decode and Encode functions which execute the respective codec functions. The following shows transforming Date objects to and from number types.

```typescript
import { Transform, Encode, Decode } from './transform'

// Applies codec functions to a type
const Timestamp = Transform(Type.Number(), {
  decode: (value) => new Date(value),
  encode: (value) => value.getTime(),
})
// Transform type can be nested within objects
const N = Type.Object({
  timestamp: Timestamp
})

// Decodes as { timestamp: Date }
const D = Decode(N, { timestamp: Date.now() })

// Encodes as { timestamp: number }
const E = Encode(N, D)
```
This implementation is somewhat similar to Zod's `transform` and `parse` where the Encode and Decode functions will effectively parse values and throw on validation fail. As TypeBox does not implement higher order functions (preferencing users implement this themselves) it's uncertain if this functionality should be part of TypeBox as standard, or moved to external packages.