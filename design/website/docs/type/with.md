# Type.With

An action that assigns a type additional annotation metadata. This action achieves the same effect as passing options, but where the options are statically observable to TypeScripts type system.

> ⚠️ This action is used to express the Script `with` keyword.

## Example

Example usage is shown below.

```typescript
const T = Type.With(Type.Number(), {                // const T = {
  minimum: 10,                                      //   type: 'number',
  maximum: 100                                      //   minimum: 10,
})                                                  //   maximum: 100
                                                    // }

                                                    // const T: TWith<TNumber, {
                                                    //   minimum: number;
                                                    //   maximum: number;
                                                    // }>
```