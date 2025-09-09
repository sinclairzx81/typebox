# Evaluate

The Evaluate function will evaluate logical type expressions and return the result.

## Example

Example usage is shown below. 

```typescript
const T = Type.Intersect([
  Type.Object({ x: Type.Number() }),
  Type.Union([  
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() }) 
  ])
])

const S = Type.Evaluate(T)                          // const S: TUnion<[
                                                    //   TObject<{
                                                    //     x: TNumber,
                                                    //     y: TNumber
                                                    //   }>,
                                                    //   TObject<{
                                                    //     x: TNumber,
                                                    //     z: TNumber
                                                    //   }>,
                                                    // ]>
```



## Remarks

The Evaluate function transforms logical type expressions into normalized forms using set-based evaluation rules. Evaluation is applied to both Union and Intersect types where Union evaluation yields the broadest disjoint types within a set while Intersect yields the narrowest.

### Union

Union evaluation yields the broadest variant.

```typescript
const T = Type.Union([Type.Literal(1), Type.Number()])

const S = Type.Evaluate(T)                          // const S = { type: 'number' }
```

### Intersect

Intersect evaluation yields the narrowest constituent

```typescript
const T = Type.Intersect([Type.Literal(1), Type.Number()])

const S = Type.Evaluate(T)                         // const S = { const: 1 }
```