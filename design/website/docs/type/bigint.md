# Type.BigInt

Creates a BigInt type.

> ⚠️ This type cannot be expressed in standard JSON Schema. Do not use it if publishing types for other languages to consume.

## Example

Example usage is shown below.

```typescript
const T = Type.BigInt()                             // const T = {
                                                    //   type: 'bigint'
                                                    // }

type T = Static<typeof T>                           // type T = bigint
```

## Guard

Use the IsBigInt function to guard values of this type.

```typescript
Type.IsBigInt(value)                                // value is TBigInt
```