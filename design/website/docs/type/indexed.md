# Index

The Index function performs a indexed access lookup on a type.

## Example

Example usage is shown below. 

```typescript
const T = Type.Object({
  x: Type.Literal(1),
  y: Type.Literal(2),
  z: Type.Literal(3)
})

const S = Type.Index(T, Type.Union([                // const S: TUnion<[
  Type.Literal('x'),                                //   TLiteral<1>,
  Type.Literal('y')                                 //   TLiteral<2>
]))                                                 // ]>
```