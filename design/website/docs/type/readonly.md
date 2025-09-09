# Readonly

The Optional function applies an `readonly` modifier to a type.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T = {
  x: Type.Readonly(Type.Number()),                  //   type: 'object',
  y: Type.Readonly(Type.Number()),                  //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number', readOnly: true },
                                                    //     y: { type: 'number', readOnly: true },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = {
                                                    //   readonly x: number,
                                                    //   readonly y: number,
                                                    //   z: number
                                                    // }
```
## Guard

Use the IsReadonly function to guard values of this type.

```typescript
Type.IsReadonly(value)                              // value is TReadonly
```