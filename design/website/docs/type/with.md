# Type.With

An action that augments a type with additional constraints and annotations. This action is similar to options, but where the option data is statically introspectable on the schema.

> ⚠️ This action is used to express the Script `with` keyword.

## Syntax

This type is a IR target for the following syntax

```typescript
type T = string with { format: 'email' }
```

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