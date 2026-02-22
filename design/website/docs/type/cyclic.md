# Type.Cyclic

Creates a Cyclic type. 

## Example

Example usage is shown below.

```typescript
const T = Type.Cyclic({                             // const T = {
  A: Type.Object({                                  //   $defs: {
    x: Type.Array(Type.Ref('A')),                   //     A: {
  }),                                               //       type: 'object',
}, 'A')                                             //       required: ['x'],
                                                    //       properties: { 
                                                    //         x: { 
                                                    //           type: 'array', 
                                                    //           items: { 
                                                    //             $ref: 'A' 
                                                    //           } 
                                                    //         } 
                                                    //       },
                                                    //       '$id': 'A'
                                                    //     }
                                                    //   },
                                                    //   $ref: 'A'
                                                    // }

type T = Static<typeof T>                           // type T = { x: ...[] }

```
## Guard

Use the IsCyclic function to guard values of this type.

```typescript
Type.IsCyclic(value)                                // value is TCyclic
```