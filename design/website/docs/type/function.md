# Type.Function

Creates a Function type. 

> ⚠️ This type is used for interface definitions and cannot be validated.

## Example

Example usage is shown below. 

```typescript
const T = Type.Function([                           // const T = {
  Type.String(),                                    //   type: 'function'
  Type.Boolean()                                    //   parameters: [
], Type.Object({                                    //     { type: 'string' },
  x: Type.Number()                                  //     { type: 'boolean' }
}))                                                 //   ],
                                                    //   returnType: {
                                                    //     type: 'object',
                                                    //     required: ['x'],
                                                    //     properties: {
                                                    //       x: { type: 'number' }
                                                    //     }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = (
                                                    //   args_0: string, 
                                                    //   args_1: boolean
                                                    // ) => { 
                                                    //   x: number 
                                                    // }
```

## Guard

Use the IsFunction function to guard values of this type.

```typescript
Type.IsFunction(value)                              // value is TFunction
```