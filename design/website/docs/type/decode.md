# Decode

The Decode function applies a uni-directional decoding transform to a type.

## Example

The following applies a Decode callback that converts a number to a Hex string


```typescript
const Hex = Type.Decode(Type.Number(),              // const T = {
  value => value.toString(16).toUpperCase()         //   type: 'number',
)                                                   //   '~codec': {
                                                    //      decode: value => value.toString(16).toUpperCase() ,
                                                    //      encode: value => { throw Error('not implemented') },
                                                    //   }
                                                    // } 

// Use Value.Decode() to run Decode callbacks.

const D = Value.Decode(Hex, 12345678)               // const D = 'BC614E'

const E = Value.Encode(Hex, D)                      // throw Error('not implemented')
```