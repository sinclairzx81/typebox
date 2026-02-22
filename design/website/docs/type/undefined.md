# Type.Undefined

Creates an Undefined type.

> ⚠️ This is type is cannot be expressed with Json. Do not use if publishing types for other languages to consume.

## Example

Example usage is shown below.

```typescript
const T = Type.Undefined()                          // const T = {
                                                    //   type: 'undefined'
                                                    // }

type T = Static<typeof T>                           // type T = undefined
```

## Guard

```typescript
Type.IsUndefined(value)                             // value is TUndefined
```
