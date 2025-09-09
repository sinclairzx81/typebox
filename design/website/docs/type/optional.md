# Optional

The Optional function applies an optional `?` modifier to a type.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T = {
  x: Type.Optional(Type.Number()),                  //   type: 'object',
  y: Type.Optional(Type.Number()),                  //   required: ['z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }


type T = Static<typeof T>                           // type T = {
                                                    //   x?: number,
                                                    //   y?: number,
                                                    //   z: number
                                                    // }
```

## Guard

Use the IsOptional function to guard values of this type.

```typescript
const checked = Type.IsOptional(value)              // value is TOptional
```