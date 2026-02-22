# Type.Readonly

The Readonly function applies an `readonly` modifier to an object property. This modifier is used for type inference and compositing only. It has no effect on validation.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T = {
  x: Type.Readonly(Type.Number()),                  //   type: 'object',
  y: Type.Readonly(Type.Number()),                  //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number', '~readonly': true },
                                                    //     y: { type: 'number', '~readonly': true },
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