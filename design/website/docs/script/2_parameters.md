# Parameters

Script can accept named type parameters.

## Example

The following passes an external String to Script and makes it nullable.

```typescript
const T = Type.String()

const S = Type.Script({ T }, `T | null`)            // const S: TUnion<[
                                                    //   TString,
                                                    //   TNull
                                                    // ]>
```

External types are referenced by property name. You can pass many types.

```typescript
const A = Type.Literal(1)
const B = Type.Literal(2)
const C = Type.Literal(3)

const T = Type.Script({ A, B, C }, `[A, B, C]`)     // const T: TTuple<[
                                                    //   TLiteral<1>,
                                                    //   TLiteral<2>,
                                                    //   TLiteral<3>
                                                    // ]>
```