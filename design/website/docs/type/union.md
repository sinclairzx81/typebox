# Union

Creates a Union type. 

## Example

Example usage is shown below.

```typescript
const T = Type.Union([                              // const T = {
  Type.String(),                                    //   anyOf: [
  Type.Number()                                     //     { type: 'string' },
])                                                  //     { type: 'number' }
                                                    //   ]
                                                    // }

type T = Static<typeof T>                           // type T = string | number
``` 

## Guard

Use the IsUnion function to guard values of this type.

```typescript
Type.IsUnion(value)                                 // value is TUnion
```
