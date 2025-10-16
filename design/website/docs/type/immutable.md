# Immutable

The Immutable function applies an `~immutable` modifier to an Array or Tuple and is used to infer `readonly T[]` for these types. This modifier is used for type inference and compositing only. It has no effect on validation.

## Example

Example usage is shown below for Array

```typescript
const T = Type.Immutable(                           // const T = {
  Type.Array(Type.Number())                         //   type: 'array', 
)                                                   //   items: { type: 'number' }, 
                                                    //   '~immutable': true
                                                    // }

type T = Static<typeof T>                           // type T = readonly number[]
```

.. and for Tuple.

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

A Immutable modifier can be applied to any type, but TypeBox only interprets type inference when the modifier is applied to Array and Tuple only.

## Guard

Use the IsImmutable function to guard values of this type.

```typescript
Type.IsImmutable(value)                         // value is TImmutable
```