# Type.AsyncIterator

Creates an AsyncIterator type. 

> ⚠️ This type is used for interface definitions and cannot be validated.

## Example

Example usage is shown below.

```typescript
const T = Type.AsyncIterator(Type.Number())         // const T = {
                                                    //   type: 'async-iterator',
                                                    //   iteratorItems: {
                                                    //     type: 'number'
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = AsyncIterableIterator<number>
 
```

## Guard

Use the IsAsyncIterator function to guard values of this type.

```typescript
Type.IsAsyncIterator(value)                         // value is TAsyncIterator
```