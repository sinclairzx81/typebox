# Type.Module

The Module function is an advanced compositing system for referential types. It performs several normalization passes, including reference inlining, cyclic type resolution, and dead code elimination for unused definitions. Conceptually, Module mirrors how TypeScript handles type references within the context of a TypeScript module.

### Referencing

Module is written in support of order independent type referencing. Consider the following where type `A` references type `B` type before definition.

```typescript
type A = 1 | B                                     // type A = 1 | 2
type B = 2                                         // type B = 2
```

Attempting the same in JavaScript results in an `Access before initialization` error

```typescript
const A = Type.Union([Type.Literal(1), B])        // Error: Cannot access 'B' before initialization
const B = Type.Literal(2)
```

Module offers a scoping mechanism that facilitates order independent referencing.

```typescript
const M = Type.Module({                     
  A: Type.Union([
    Type.Literal(1), 
    Type.Ref('B')                                  // Referenced before definition.
  ]), 
  B: Type.Literal(2)
})

M.A                                                // const A: TUnion<TLiteral<1>, TLIteral<2>>
M.B                                                // const B: TLiteral<2>
```

## Inline

The Module function will automatically inline referenced types. Inlining means the referenced type is cloned directly into the referring type, so the final result is a fully self-contained type without external dependencies.

```typescript
const { A, B, C } = Type.Module({                   // const A: TNumber
  A: Type.Number(),                                 //
  B: Type.String(),                                 // const B: TString
  C: Type.Object({                                  // 
    a: Type.Ref('A'),                               // const C: TObject<{
    b: Type.Ref('B')                                //   a: TNumber,  // <-- inlined
  })                                                //   b: TString   // <-- inlined
})                                                  // }>
```

## Cyclic

The Module function will automatically detect self-referential types and transform them into instances of TCyclic.

```typescript
const { A } = Type.Module({                         // const A: TCyclic<{
  A: Type.Object({                                  //   A: TObject<{
    b: Type.Ref('B')                                //     b: TRef<'B'>,
  }),                                               //   }>,
  B: Type.Object({                                  //   B: TObject<{
    a: Type.Ref('A')                                //     a: TRef<'A'>
  })                                                //   }>
})                                                  // }, 'A'>

```

## Dead Code Elimination

Module also performs dead code elimination, ensuring that each definition only includes the types required for itself. In the following example, the `C` definition is present, but since `A` and `B` do not reference it, `C` is excluded from their referential set.

```typescript
const { A } = Type.Module({                         // const A: TCyclic<{
  A: Type.Object({                                  //   A: TObject<{
    b: Type.Ref('B')                                //     b: TRef<'B'>,
  }),                                               //   }>,
  B: Type.Object({                                  //   B: TObject<{
    a: Type.Ref('A')                                //     a: TRef<'A'>
  }),                                               //   }>
  C: Type.String()                                  // }, 'A'>
})                                                  

```