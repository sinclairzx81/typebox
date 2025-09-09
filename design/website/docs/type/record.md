# Record

Creates a Record type.

## Example

Example usage is shown below.

```typescript
const T = Type.Record(Type.String(), Type.Number()) // const T = {
                                                    //   type: 'object',
                                                    //   patternProperties: {
                                                    //     "^.*$": {
                                                    //        type: 'number'
                                                    //     }
                                                    //   }

type T = Static<typeof T>                           // type T = {
                                                    //   [x: string]: number
                                                    // }
```

## Guard

Use the IsRecord function to guard values of this type.

```typescript
Type.IsRecord(value)                                // value is TRecord<string, TSchema>
```