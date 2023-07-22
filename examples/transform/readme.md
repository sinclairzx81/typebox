# Transform Types

Transform Types are an experimental codec system that supports deferred encode and decode of typed data structures received over IO interfaces. This system is undergoing consideration for inclusion in the TypeBox library.

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
})                                                 // above will infer as { timestamp: number } (as derived from 
                                                   // the TB type)



const D = Decode(N, { timestamp: 123 })            // const D = { timestamp: Date(123) }
                                                   //
                                                   // The Decode function accepts any type plus a value. The Decode 
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

A practical use case for Transform types is the automatic encode and decode of values received over the network. The following is an example implementation using the Fastify web framework with the TypeBox Type Provider (used for auto type inference). Note that this usage wouldn't be exclusive to Fastify. The implementation below uses explicit Decode and Encode within a route handler.

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

From the example above, the current design of Transform types would require explicit Encode and Decode within a route handler (or other function in receipt of data); and it would be very challenging for general purpose frameworks to integrate this functionality in a more concise fashion (currently). 

Possible options to make this more cohesive may be to provide route wrapping functions to handle codec execution and type inference.  More integrated solutions would involve framework maintainers offering codec supportive type definitions to act as hooks for auto static inference (on both decode and encode phases). The latter option is the preference but would require a fair amount of engineering in downstream frameworks.

Given the many unknowns and general complexity surrounding this feature, TypeBox offers the Transform implementation to the community (as a single `transform.ts` module) for experimentation and general feedback. TypeBox welcomes third party packages, example user integrations, code enhancements or general insight into end user usage patterns.