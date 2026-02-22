# Type.Generic

Creates a Generic type. Generic types can be instantiated with Call.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below. 

```typescript
const G = Type.Generic([Type.Parameter('T')],       // const G = {
  Type.Array(Type.Ref('T')))                        //   type: 'generic',
                                                    //   parameters: [{ 
                                                    //     name: 'T', 
                                                    //     extends: {}, 
                                                    //     equals: {}
                                                    //   }], 
                                                    //   expression: {
                                                    //     type: 'object', 
                                                    //     required: ['x'],
                                                    //     properties: { 
                                                    //       x: { 
                                                    //         '$ref': 'T' 
                                                    //       } 
                                                    //     },
                                                    //   }
                                                    // }

const S = Type.Call(G, [Type.Number()])             // const S: TArray<TNumber>
```

## Guard

Use the IsGeneric function to guard values of this type.

```typescript
Type.IsGeneric(value)                               // value is TGeneric
```