# Type.Codec

The Codec function applies a bi-directional transform codec to a type.

## Example

The following creates a Codec that transforms a timestamp into a Date object.

```typescript
const Timestamp = Type.Codec(Type.Integer())        // const Timestamp = {
  .Decode(value => new Date(value))                 //   type: 'integer',
  .Encode(value => value.getTime())                 //   '~codec': {
                                                    //      decode: value => new Date(), 
                                                    //      encode: value => value.getTime()
                                                    //   }
                                                    // } 

// Use Value.Decode() and Value.Encode() to run Decode and Encode callbacks.

const D = Value.Decode(Timestamp, 12345)            // const D = 1970-01-01T00:00:12.345Z

const E = Value.Encode(Timestamp, D)                // const E = 12345
```

## Static

Use the StaticDecode and StaticEncode types that infer the Decoded and Encoded state of a type.

```typescript
import Type, { type StaticEncode, type StaticDecode } from 'typebox'

const Timestamp = Type.Codec(Type.Integer())
  .Decode(value => new Date(value))
  .Encode(value => value.getTime())

type D = StaticDecode<typeof Timestamp>             // type D = Date

type E = StaticEncode<typeof Timestamp>             // type E = number
```