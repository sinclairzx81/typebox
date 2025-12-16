# ReadonlyObject

This type is an alias for the `Readonly<T>` TypeScript utility type. It makes all properties of an Object `readonly` or marks an Array or Tuple as immutable `readonly T[]`.

## Example

When applied to a Object, each property of the Object will be marked as `TReadonly<T>`

```typescript
const T = Type.Object({                             // const T = TObject<{
  x: Type.Number(),                                 //   x: TNumber,
  y: Type.Number(),                                 //   y: TNumber,
  z: Type.Number()                                  //   z: TNumber,
})                                                  // }>

const S = Type.ReadonlyObject(T)                      // const S: TObject<{
                                                    //   x: TReadonly<TNumber>,
                                                    //   y: TReadonly<TNumber>,
                                                    //   z: TReadonly<TNumber>
                                                    // }>
```

When applied to an Array or Tuple, the type is marked as `TImmutable<T>`

```typescript
const T = Type.Tuple([                              // const T = TImmutable<TTuple<[
  Type.Number(),                                    //   TNumber,
  Type.String(),                                    //   TString
])                                                  // ]>>

const S = Type.ReadonlyObject(T)                      // const S: TImmutable<TTuple<[
                                                    //   TNumber,
                                                    //   TString
                                                    // }>>

type S = Type.Static<typeof S>                      // type S = readonly [number, string]
```