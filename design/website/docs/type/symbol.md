# Type.Symbol

Creates a Symbol type.

> ⚠️ This type cannot be expressed in standard JSON Schema. Do not use it if publishing types for other languages to consume.

## Example

Example usage is shown below.

```typescript
const T = Type.Symbol()                             // const T = {
                                                    //   type: 'symbol'
                                                    // }

type T = Static<typeof T>                           // type T = symbol
```

## Guard

Use the IsSymbol function to guard values of this type.

```typescript
Type.IsSymbol(value)                                // value is TSymbol
```