
## [0.18.0](https://www.npmjs.com/package/@sinclair/typebox/v/0.18.0)

Changes:

- Function `Type.Intersect(...)` now implemented via `allOf` and constrained with `unevaluatedProperties` (as per draft `2019-09`)
- Deprecates `Type.Dict(...)` for `Type.Record(...)`.
- Support for 

Notes:

This update changes the TypeBox JSON schema target to draft `2019-09`. This allows for `Type.Intersect(...)` types to be represented with `allOf`, but whose `additionalProperties` are constrained with `unevaluatedProperties`. Note that `unevaluatedProperties` is only available in the `2019-09` draft. All other schemas remain as they were, with this change only applicable to `Type.Intersect(...)` representation only. This update also reintroduces TypeBox's ability to intersect `Type.Object(...)` with `Type.Dict(...)`.

```typescript
const User = Type.Object({
    name: Type.String(),
    email: Type.String({ format: 'email' })
})

const UserExtended = Type.Intersect([
    User,
    Type.Record(Type.String())
])

// Analogous to

type User = {
    name: string,
    email: string
}

type UserExtended = User & {
    [key: string]: string
}
```

In addition, this update also renames `Type.Dict(...)` to `Type.Record(...)` as per contributor feedback. The `Type.Record(...)` functions exactly as `Type.Dict(...)` but aligns closer to the TS utility type `Record<Keys, Type>` whose keys are all of type `string`. 


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