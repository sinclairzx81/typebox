# Type.Dependent

Creates a Dependent type.

> ⚠️ This type is an experimental syntax extension used to express Dependent Conditional Type semantics via JSON Schema `if/then/else`. TypeScript doesn't currently provide a means to express the semantics of this type, but may in the future. Users of `Dependent` should therefore be mindful that should TypeScript introduce Dependent Types in future, TypeBox may need to amend its implementation in line with TypeScript.

## Example

Example usage is shown below.

```typescript
const T = Type.Dependent([                          // const T = {
  Type.Number(),                                    //   if: { type: 'number' },
  Type.Literal(1),                                  //   then: { type: 'number', const: 1 },
  Type.String()                                     //   else: { type: 'string' }
])                                                  // }


type T = Static<typeof T>                           // type T = 1 | string
```

## Syntax

This type is a IR target for the following syntax

```typescript
type T = if number then 1 else string
```

## Lowering

As Dependent typing is not a feature of TypeScript, TypeBox uses the following lowering expression for type inference.

```typescript
type Dependent<If, Then, Else> = (If & Then) | Exclude<Else, If>
```

Where immediate inference is resolved via the following.

```typescript
// type T = if number then 1 else string

// Dependent<number, 1, string>
// = (number & 1) | Exclude<string, number>
// = (1)          | Exclude<string, number>   -- intersection
// = (1)          | (string)                  -- negation

type T = 1 | string // result
```

Some further examples:

```typescript
type A = Dependent<number, 1, string>   // 1 | string
type B = Dependent<number, 1, never>    // 1
type C = Dependent<number, 1, unknown>  // unknown
```

## Guard

Use the `IsDependent` function to guard values of this type.

```typescript
Value.IsDependent(value)                            // value is TDependent
```