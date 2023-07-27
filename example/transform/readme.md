# Transform

Use Transform to apply codec functions to a type. Transform is designed to be used with the Decode and Encode functions to handle automatic encode and decode of JSON values. The following shows transforming Date objects to and from number types.

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