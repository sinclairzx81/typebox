## [0.20.1](https://www.npmjs.com/package/@sinclair/typebox/v/0.20.1)

Updates:

- TypeBox mandates TypeScript compiler version `4.3.5` and above.

## [0.20.0](https://www.npmjs.com/package/@sinclair/typebox/v/0.20.0)

Updates:

- Function `Type.Rec(...)` signature change.
- Minor documentation updates.

Notes:

The `Type.Rec(...)` function signature has been changed to allow passing the `$id` as a custom option. This is to align `Type.Rec(...)` with other functions that accept `$id` as an option. `Type.Rec(...)` can work with or without an explicit `$id`, but it is recommend to specify one if the recursive type is nested in an outer schema.

```typescript
const Node = Type.Rec(Self => Type.Object({
    id: Type.String(),
    nodes: Type.Array(Self)
}), { $id: 'Node' })
```

## [0.19.0](https://www.npmjs.com/package/@sinclair/typebox/v/0.19.0)

Updates:

- Function `Type.Box(...)` removes `$id` parameter as first argument.
- Function `Type.Ref(...)` is now overloaded to support referencing `Type.Box(...)` and `TSchema`.

Notes:

This update changes the signature of `Type.Box(...)` and removes the explicit `$id` passing on the first parameter. The `$id` must be passed as an option if the caller wants to reference that type.

```typescript
const T = Type.String({ $id: 'T' })

const B = Type.Box({ T }, { $id: 'B' })

const R1 = Type.Ref(T)                   // const R1 = { $ref: 'T' }

const R2 = Type.Ref(B, 'T')              // const R2 = { $ref: 'B#/definitions/T' }
```

## [0.18.1](https://www.npmjs.com/package/@sinclair/typebox/v/0.18.1)

- Function `Type.Enum(...)` now expressed with `anyOf`. This to remove the `allowUnionTypes` configuration required to use `enum` with in AJV strict.
- Function `Type.Rec(...)` now takes a required `$id` as the first parameter.
- Function `Type.Strict(...)` no longer includes a `$schema`. Callers can now optionally pass `CustomOptions` on `Type.Strict(...)`

## [0.18.0](https://www.npmjs.com/package/@sinclair/typebox/v/0.18.0)

Changes:

- Function `Type.Intersect(...)` is now implemented with `allOf` and constrained with `unevaluatedProperties` (draft `2019-09`)
- Function `Type.Dict(...)` has been deprecated and replaced with `Type.Record(...)`.
- Function `Type.Strict(...)` now includes the `$schema` property referencing the `2019-09` draft.

### Type.Intersect(...)

TypeBox now targets JSON schema draft `2019-09` for expressing `Type.Intersect(...)`. This is now expressed via `allOf` with additionalProperties constrained with `unevaluatedProperties`. Note that `unevaluatedProperties` is a feature of the `2019-09` specification.

### Type.Record(K, V)

TypeBox has deprecated `Type.Dict(...)` in favor of the more generic `Type.Record(...)`. Where as `Type.Dict(...)` was previously expressed with `additionalProperties: { ... }`, `Type.Record(...)` is expressed with `patternProperties` and supports both `string` and `number` indexer keys. Additionally, `Type.Record(...)` supports string union arguments. This is analogous to TypeScript's utility record type `Record<'a' | 'b' | 'c', T>`.

## [0.17.7](https://www.npmjs.com/package/@sinclair/typebox/v/0.17.7)

Changes:

- Added optional `$id` argument on `Type.Rec()`.
- Documentation updates.

## [0.17.6](https://www.npmjs.com/package/@sinclair/typebox/v/0.17.6)

Changes:

- Added `Type.Rec(...)` function.

Notes:

This update introduces the `Type.Rec()` function for enabling Recursive Types. Please note that due to current inference limitations in TypeScript, TypeBox is unable to infer the type and resolves inner types to `any`. 

This functionality enables for complex self referential schemas to be composed. The following creates a binary expression syntax node with the expression self referential for left and right oprands.

```typescript
const Operator = Type.Union([
    Type.Literal('+'),
    Type.Literal('-'),
    Type.Literal('/'),
    Type.Literal('*')
])

type Expression = Static<typeof Expression>

// Defines a self referencing type.
const Expression = Type.Rec(Self => Type.Object({
    left:     Type.Union([Self, Type.Number()]), 
    right:    Type.Union([Self, Type.Number()]),
    operator: Operator
}))

function evaluate(expression: Expression): number {
    const left = typeof expression.left  !== 'number' 
        ? evaluate(expression.left as Expression)  // assert as Expression
        : expression.left
    const right = typeof expression.right  !== 'number' 
        ? evaluate(expression.right as Expression) // assert as Expression
        : expression.right
    switch(expression.operator) {
        case '+': return left + right
        case '-': return left - right
        case '*': return left * right
        case '/': return left / right
    }
}

const result = evaluate({
    left: {
        left: 10, 
        operator: '*',
        right: 4, 
    },
    operator: '+',
    right: 2,
}) // -> 42
```

This functionality is flagged as `EXPERIMENTAL` and awaits community feedback.

## [0.17.4](https://www.npmjs.com/package/@sinclair/typebox/v/0.17.4)

Changes:

- Added `Type.Box()` and `Type.Ref()` functions.

Notes:

This update provides the `Type.Box()` function to enable common related schemas to grouped under a common namespace; typically expressed as a `URI`. This functionality is primarily geared towards allowing one to define a common set of domain objects that may be shared across application domains running over a network. The `Type.Box()` is intended to be an analog to `XML` `xmlns` namespacing.

The `Type.Ref()` function is limited to referencing from boxes only. The following is an example.

```typescript
// Domain objects for the fruit service.
const Fruit = Type.Box('https://fruit.domain.com', {
    Apple:  Type.Object({ ... }),
    Orange: Type.Object({ ... }),
})

// An order referencing types of the fruit service.
const Order = Type.Object({
    id:       Type.String(),
    quantity: Type.Number(),
    item:     Type.Union([
        Type.Ref(Fruit, 'Apple'),
        Type.Ref(Fruit, 'Orange')
    ])
})
```
> Note: As of this release, the `Type.Omit()`, `Type.Pick()`, `Type.Partial()`, `Type.Readonly()` and `Type.Intersect()` functions do not work with Reference Types. This may change in later revisions.

For validation using `Ajv`, its possible to apply the `Box` directly as a schema.

```typescript
ajv.addSchema(Fruit) // makes all boxed types known to Ajv
```

This functionality is flagged as `EXPERIMENTAL` and awaits community feedback.

## [0.17.1](https://www.npmjs.com/package/@sinclair/typebox/v/0.17.1)

- Remove default `additionalProperties: false` constraint from all object schemas.

This update removes the `additionalProperties: false` constraint on all object schemas. This constraint was introduced on `0.16.x` but has resulted in significant downstream problems composing schemas whose types `intersect`. This is due to a JSON schema design principle where constraints should only be added (never removed), and that intersection types may require removal of the `additionalProperties` constraint in some cases, this had resulted in some ambiguity with respect to how TypeBox should handle such intersections. 

This update can also be seen as a precursor towards TypeBox potentially leveraging `unevaluatedProperties` for type intersection in future releases. Implementors should take note that in order to constrain the schema to known properties, one should apply the `additionalProperties: false` as the second argument to `Type.Object({...})`. 

```typescript
const T = Type.Object({
    a: Type.String(),
    b: Type.Number()
}, { 
    additionalProperties: false 
})