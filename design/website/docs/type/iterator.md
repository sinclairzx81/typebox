# Iterator

Creates an Iterator type. 

> ⚠️ This type is used for interface definitions and cannot be validated.

## Example

```typescript
const T = Type.Iterator(Type.Number())              // const T = {
                                                    //   type: 'iterator',
                                                    //   iteratorItems: {
                                                    //     type: 'number'
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = IterableIterator<number>
 
```

## Guard

Use the IsIterator function to guard values of this type.

```typescript
Type.IsIterator(value)                              // value is TIterator
```