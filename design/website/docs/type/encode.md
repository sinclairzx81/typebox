# Encode

The Encode function applies a uni-directional encoding transform to a type.

## Example

The following applies an Encode callback. 

> ⚠️ Encode callbacks will receive a value of type `unknown`. This is because TypeBox cannot statically derive the Decoded state, only the Encoded state as given by the schematic type. Applications should apply appropriate runtime checks local to the callback and throw if receiving invalid values.

```typescript
const T = Type.Encode(Type.Number(),                // const T = {
  (value: unknown) => value === 'hello'             //   type: 'number',
     ? 1                                            //   '~codec': {
     : 0                                            //      decode: value => { throw Error('not implemented') }, 
)                                                   //      encode: value => 0
                                                    //   }
                                                    // } 

// Use Value.Encode() to run Encode callbacks.

const D = Value.Decode(T, 12345)                   // throw Error('not implemented')

const E = Value.Encode(T, 'hello')                 // const E = 1
```