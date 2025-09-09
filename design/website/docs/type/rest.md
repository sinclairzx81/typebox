# Rest

Creates a Rest type.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below.

```typescript
const T = Type.Rest(Type.Tuple([                    // const T = {
  Type.Literal(1),                                  //   type: "rest",
  Type.Literal(2)                                   //   items: {
]))                                                 //     type: "array",
                                                    //     additionalItems: false,
                                                    //     items: [
                                                    //       { const: 1 }, 
                                                    //       { const: 2 } 
                                                    //     ],
                                                    //     minItems: 2
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type A = [1, 2][]
```

## Guard

Use the IsRest function to guard values of this type.

```typescript
Type.IsRest(value)                                  // value is TRest
```