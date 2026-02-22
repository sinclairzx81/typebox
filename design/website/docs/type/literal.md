# Type.Literal

Creates a Literal type. Supported values are BigInt, Boolean, Number and String.


## Example

Example usage is shown below.

```typescript
const A = Type.Literal(1n)                          // const A = {
                                                    //   type: 'bigint',
                                                    //   const: 1n
                                                    // }

const B = Type.Literal(true)                        // const B = {
                                                    //   type: 'boolean',
                                                    //   const: true
                                                    // }

const C = Type.Literal(32)                          // const C = {
                                                    //   type: 'number',
                                                    //   const: 32
                                                    // }

const D = Type.Literal('hello')                     // const D = {
                                                    //   type: 'string',
                                                    //   const: 'hello'
                                                    // }
```

## Guard

Use the IsLiteral function to guard values of this type.

```typescript
Type.IsLiteral(value)                                // value is TLiteral<TLiteralValue>
```