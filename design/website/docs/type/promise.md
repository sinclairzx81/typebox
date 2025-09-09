# Promise

Creates a Promise type. 

> ⚠️ This type is used for interface definitions and cannot be validated.

## Example

Example usage is shown below.

```typescript
const T = Type.Promise(Type.Number())               // const T = {
                                                    //   type: 'promise',
                                                    //   item: { type: 'number' }
                                                    // }

type T = Static<typeof T>                           // type T = Promise<number>
```

## Guard

Use the IsPromise function to guard values of this type.

```typescript
Type.IsPromise(value)                               // value is TPromise<TSchema>
```