# Type.Symbol

Creates a Symbol type. 

> ⚠️ This is type is cannot be expressed with Json. Do not use if publishing types for other languages to consume.

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