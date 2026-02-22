# Type.Ref

Creates a Ref type.

## Example

Example usage is shown below.

```typescript
const T = Type.Ref('A')                             // const T = {
                                                    //   $ref: 'A'
                                                    // }

type T = Static<typeof T>                           // type T = unknown
```

## Guard

Use the IsRef function to guard values of this type.

```typescript
Type.IsRef(value)                                   // value is TRef
```