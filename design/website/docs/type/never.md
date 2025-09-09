# Never

Creates a Never type.

## Example

Example usage is shown below.

```typescript
const T = Type.Never()                              // const T = {
                                                    //   not: {}
                                                    // }

type T = Static<typeof T>                           // type T = never
```

## Guard

Use the IsNever function to guard values of this type.

```typescript
Type.IsNever(value)                                 // value is TNever
```