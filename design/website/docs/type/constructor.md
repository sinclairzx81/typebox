# Constructor

Creates a Constructor type. 

> ⚠️ This type is used for interface definitions and cannot be validated.

## Example

Example usage is shown below.

```typescript
const T = Type.Constructor([                        // const T = {
  Type.String(),                                    //   type: 'constructor'
  Type.Boolean(),                                   //   parameters: [
], Type.Object({                                    //     { type: 'string' },
  x: Type.Number()                                  //     { type: 'boolean' }
}))                                                 //   ],
                                                    //   instanceType: {
                                                    //     type: 'object',
                                                    //     required: ['x'],
                                                    //     properties: {
                                                    //       x: { type: 'number' }
                                                    //     }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = new (
                                                    //   args_0: string, 
                                                    //   args_1: boolean
                                                    // ) => { 
                                                    //   x: number 
                                                    // }
```
## Guard

```typescript
Type.IsConstructor(value)                           // value is TConstructor<TSchema[], TSchema>
```