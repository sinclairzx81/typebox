# Advanced

Script supports advanced schema transformations using programmable constructs of the TypeScript programming language.

## Mapped Property Keys

The following uses Script to map and rename property keys.

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const S = Type.Script({ T }, '{ [K in keyof T as `prop${Uppercase<K>}`]: T[K] }'})

                                                    // const S: TObject<{
                                                    //   propX: TNumber;
                                                    //   propY: TNumber;
                                                    //   propZ: TNumber;
                                                    // }>
```

## Deep Partial

The following uses Script to create a DeepPartial type.

```typescript
const DeepPartial = Type.Script(`<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K]
}`)

const Result = Type.Script({ DeepPartial }, `DeepPartial<{
  x: {
    y: { 
      z: 1
    }
  }
}>`)                                                // const Result: TObject<{
                                                    //   x: TOptional<TObject<{
                                                    //     y: TOptional<TObject<{
                                                    //       z: TOptional<TLiteral<1>>
                                                    //     }>>
                                                    //   }>>
                                                    // }>
```

## Reverse Elements

The following uses Script to reverse elements within a Tuple.

```typescript
const Reverse = Type.Script(`<List, Result extends unknown[] = []> = (
  List extends [infer Head, ...infer Tail extends unknown[]]
    ? Reverse<Tail, [Head, ...Result]>
    : Result
)`)

const Result = Type.Script({ Reverse }, `Reverse<[
  1, 2, 3, 4
]>`)                                                // const Result: TTuple<[
                                                    //   TLiteral<4>,
                                                    //   TLiteral<3>,
                                                    //   TLiteral<2>, 
                                                    //   TLiteral<1>
                                                    // ]>
```