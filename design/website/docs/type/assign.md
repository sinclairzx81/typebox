## Assign

Assigns additional option properties to a schema. This function is similar to passing options via last argument on types, but allows options to be assigned after type creation. 

## Example

```typescript
const T = Type.Number()                             // const T = {
                                                    //   type: 'number'
                                                    // }

const S = Type.Assign(T, {                          // const S = {
  minimum: 10,                                      //   type: 'number',
  maximum: 100                                      //   minimum: 10,
})                                                  //   maximum: 100
                                                    // }
```

Assign can be used with Script where it enables TS types to be augmented.

```typescript
const User = Type.Script(`{
  userId: Assign<string, { format: 'uuid' }>,
  email: Assign<string, { format: 'email' }>
}`)
```
