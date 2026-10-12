# Type.Undefined

Creates an Undefined type.

> ⚠️ This type cannot be expressed in standard JSON Schema. Do not use it if publishing types for other languages to consume.

## Example

Example usage is shown below.

```typescript
const T = Type.Undefined()                          // const T = {
                                                    //   type: 'undefined'
                                                    // }

type T = Static<typeof T>                           // type T = undefined
```

## Guard

Use the IsUndefined function to guard values of this type.

```typescript
Type.IsUndefined(value)                             // value is TUndefined
```
