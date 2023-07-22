# Transform

Transform types are an experimental codec system that supports deferred encode and decode of typed data structures received over IO interfaces. This system is undergoing consideration for inclusion in the TypeBox library.

### Design

The following is the high level design for Transform types. It consists of three functions, `Transform`, `Decode` and `Encode`. The following is the general usage.

```typescript
import { Transform, Encode, Decode } from './transform'

const Timestamp = Transform(Type.Number(), {       // The Transform function wraps a TypeBox type with two codec
  decode: (value) => new Date(value),              // functions which implement logic to decode a received value
  encode: (value) => value.getTime(),              // (i.e. number) into a application type (Date). The encode
})                                                 // function handles the reverse mapping.

type N = Static<typeof N>                          // type N = { timestamp: number }
                                                   //
const N = Type.Object({                            // Transform types are to be used like any other type and will
  timestamp: Timestamp                             // infer as the original TypeBox type. For example, the type `N` 
})                                                 // above will infer as number (as derived from the TB type)



const D = Decode(N, { timestamp: 123 })            // const D = { timestamp: Date(123) }
                                                   //
                                                   // The Decode function accepts any type and a value. The Decode 
                                                   // function return type will be that of the transforms decode() 
                                                   // return type (which is Date), with the second argument statically
                                                   // typed as N. This function acts as a kind of parse() that returns 
                                                   // the decoded type or throws on validation error.
                                               

const E = Encode(N, { timestamp: new Date(123) })  // const E = { timestamp: 123 }
                                                   //
                                                   // The encode function performs the inverse, accepting the
                                                   // decoded type { timestamp: Date } and re-encoding to the
                                                   // target type { timestamp: number }. This function will
                                                   // also throw on validation error.
```
### Integration

A practical usage for Transform types is the automatic encode and decode of values received over the network. The following is an example implementation using the Fastify web framework with the typebox type provider (which is used for auto type inference). The implementation below uses explicit Decode and Encode within the Fastify route handler.

```typescript
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify from 'fastify'

const Data = Type.Object({                       
  timestamp: Transform(Type.Number(), {       
    decode: (value) => new Date(value),         
    encode: (value) => value.getTime(),     
  })                           
})

Fastify().withTypeProvider<TypeBoxTypeProvider>().post('/', {
  schema: {
    body: Data
    response: { 200: Data }
  }
}, (req, res) => {
  const decoded = Decode(Data, req.body)           // decode { timestamp: number }
                                                   //     as { timestamp: Date }

  // ... some operations on decoded value
  //
  // i.e. decoded.timestamp.getTime()

  const encoded = Encode(Data, decoded)            // encode { timetamp: Date }
                                                   //     as { timestamp: number }
  
  res.status(200).send(encoded)                    // send!
})
```

### Current Status

As of now, the current design of Transform types mandates explicit Encode and Decode within the route handler; and as it would be very challenging for general purpose frameworks (such has Fastify) to integrate this functionality in a more concise fashion. Possible options to make this simpler may involve providing route wrapping functions to handle codec execution and type inference, more integrated solutions would involve framework maintainers offering codec supportive type definitions to act as hooks for auto static inference (on both decode and encode phases)

Given the many unknowns and general complexity surrounding this feature, TypeBox offers the Transform implementation to the community (as a single `transform.ts` module) for experimentation and general feedback. TypeBox welcomes third party packages, user integrations, code enhancements or general insight into the above design, or even suggestions on alternative designs.