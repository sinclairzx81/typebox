# Type.Immutable

The Immutable function applies an `~immutable` modifier to an Array or Tuple and is used to infer `readonly T[]` for these types. This modifier is used for type inference and composition only. It has no effect on validation.

## Example

Example usage for an Array is shown below.

```typescript
const T = Type.Immutable(                           // const T = {
  Type.Array(Type.Number())                         //   type: 'array',
)                                                   //   items: { type: 'number' },
                                                    //   '~immutable': true
                                                    // }

type T = Static<typeof T>                           // type T = readonly number[]
```

The following example applies it to a Tuple.

```typescript
const T = Type.Immutable(                           // const T = {
  Type.Tuple([Type.String(), Type.Number()])        //   type: 'array',
)                                                   //   additionalItems: false,
                                                    //   items: [
                                                    //     { type: 'string' },
                                                    //     { type: 'number' }
                                                    //   ],
                                                    //   minItems: 2,
                                                    //   '~immutable': true
                                                    // }

type T = Type.Static<typeof T>                      // type T = readonly [string, number]
```

## Remarks

An Immutable modifier can be applied to any type, but TypeBox only uses it for type inference when applied to arrays and tuples.

## Guard

Use the IsImmutable function to guard values of this type.

```typescript
Type.IsImmutable(value)                         // value is TImmutable
```