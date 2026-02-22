# Type.Tuple

Creates a Tuple type.

## Example

Example usage is shown below.

```typescript
const T = Type.Tuple([                              // const T = {
  Type.String(),                                    //   type: 'array', 
  Type.Number(),                                    //   additionalItems: false, 
])                                                  //   minItems: 2,
                                                    //   items: [
                                                    //     { type: 'string' },
                                                    //     { type: 'number' },
                                                    //   ]
                                                    // }

type T = Static<typeof T>                           // type T = [string, number]
```

## Guard

Use the IsTuple function to guard values of this type.

```typescript
Type.IsTuple(value)                                 // value is TTuple
```





