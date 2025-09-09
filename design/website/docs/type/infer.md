# Infer

Creates an Infer instruction to extract types in conditional type expression.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below. 

```typescript
const T = Type.Object({
  x: Type.Literal(1),
  y: Type.Literal(2)
})

const S = Type.Conditional(T, Type.Object({         // const S: TTuple<[
  x: Type.Infer('X'),                               //   TLiteral<1>,
  y: Type.Infer('Y'),                               //   TLiteral<2>
}), Type.Tuple([                                    // ]>
  Type.Ref('X'),
  Type.Ref('Y')
]), Type.Never())                                   
```

## Guard

Use the IsInfer function to guard values of this type.

```typescript
Type.IsInfer(value)                                 // value is TInfer
```