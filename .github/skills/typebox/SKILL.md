---
name: typebox
description: "Use when writing or reviewing TypeBox schemas, Type.Script definitions, Schema validators, Value operations, or Type.Static inference in TypeScript or JavaScript projects using the typebox package."
---

# TypeBox

TypeBox creates JSON Schema with TypeScript inference. Prefer the smallest
appropriate API and keep schema construction, validation, and value mutation
separate.

## Imports

Prefer the following imports when running TypeBox in server-side environments:

```typescript
import Type   from 'typebox'
import Schema from 'typebox/schema'
import Value  from 'typebox/value'
```

For frontend, use `import * as Type from 'typebox'` which enables tree-shaking.

## Choose an API

- **Type.***: hand-written schemas and TypeScript utility schemas.
- **Type.Script**: schemas authored as TypeScript syntax, mapped types,
  declarations, or externally supplied DSL text. Prefer Type.* for ordinary
  application code.
- **Schema.Compile**: reusable or hot-path validation. Accepts JSON
  Schema-producing Type.* schemas, including compatible Type.Script(...)
  results, as well as raw JSON Schema values.
- **Value.***: Value processing utilities.

Use Type.Static\<typeof T\> at the point where a schema's static type is
needed. Plain JSON Schema can also be passed to Type.Static. Type.Static
only infers a TypeScript type; it does not validate runtime values.

## Type Builders

### JSON Schema Types

```typescript
Type.Any()
Type.Array(T)
Type.Boolean()
Type.Cyclic({ Node: Type.Object({ next: Type.Optional(Type.Ref('Node')) }) }, 'Node')
Type.Enum(['A', 'B'])
Type.Integer()
Type.Interface([...heritage], { ...properties })
Type.Intersect([A, B])
Type.Literal('value')
Type.Never()
Type.Null()
Type.Number()
Type.Object({ id: Type.String(), name: Type.Optional(Type.String()) })
Type.Record(Type.String(), Type.Number())
Type.String()
Type.TemplateLiteral('item-${string}')
Type.Tuple([Type.String(), Type.Number()])
Type.Union([Type.String(), Type.Null()])
Type.Unknown()
```

Type.Optional and Type.Readonly are property modifiers for Type.Object and
Type.Interface properties. Type.Ref is used with Type.Cyclic. Builders accept
a trailing options object for JSON Schema keywords and annotations such as
format, default, $id, minimum, and additionalProperties.

Type.Object is not strict by default, so additional properties are allowed.
Use Type.Object(properties, { additionalProperties: false }) when a finalized
schema must reject unknown properties. Apply this restriction only after type
composition and utility operations are complete, because
additionalProperties: false closes the schema and can result in illogical schematics when used with intersections.

### JavaScript Types

These builders model JavaScript values and behavior in TypeBox; they are not
portable JSON Schema:

```typescript
Type.BigInt()
Type.Constructor([A, B], Return)
Type.Function([A, B], Return)
Type.Symbol()
Type.Undefined()
Type.Void()
```

### Type Options

Types accept Options on the last argument of any given type:

```typescript
Type.Script({ 
  format: 'email' 
})

Type.Object({
  id: Type.String()
}, {
  additionalProperties: false
})
```

Do not use these types in OpenAPI, MCP schemas, or other workflows that emit
or consume JSON Schema. Use JSON-compatible builders such as Type.String,
Type.Number, Type.Object, and Type.Union at those boundaries instead.

### Type Mapping

```typescript
// Operators
Type.Index(T, ['x', 'y'])
Type.KeyOf(T)

// Utilities
Type.Capitalize(T)
Type.ConstructorParameters(T)
Type.Exclude(U, T)
Type.Extract(U, T)
Type.InstanceType(T)
Type.Lowercase(T)
Type.NonNullable(T)
Type.Omit(T, ['a', 'b'])
Type.Parameters(T)
Type.Partial(T)
Type.Pick(T, ['a', 'b'])
Type.ReadonlyObject(T)
Type.Required(T)
Type.ReturnType(T)
Type.Uncapitalize(T)
Type.Uppercase(T)
Type.Evaluate(expression)
```

Type.Evaluate is a TypeBox-specific operation that evaluates and flattens
logical intersection schemas into a canonical schema. Use it when form
builders, documentation generators, or other infrastructure needs a flattened
object instead of an allOf representation:

```typescript
const A = Type.Intersect([
  Type.Object({ x: Type.Number() }),
  Type.Object({ y: Type.Number() }),
  Type.Object({ z: Type.Number() }),
])

const B = Type.Evaluate(A)      // Type.TObject<{ 
                                //   x: Type.TNumber, 
                                //   y: Type.TNumber, 
                                //   z: Type.TNumber 
                                // }>
```

### Unsafe and Refine

```typescript
Type.Refine(T, predicate)       // runtime-only constraint
Type.Unsafe<MyType>(schema)     // attach a static type to an arbitrary schema
```

Type.Unsafe and Type.Refine form a pair for extension types. Use Type.Unsafe to assign
the intended static type and schema representation, then use Type.Refine to add
the JavaScript runtime predicate:

```typescript
const Timestamp = Type.Refine(
  Type.Unsafe<Date>({}),
  (value) => value instanceof Date
)
```

Type.Refine is not portable because its predicate is JavaScript. Type.Unsafe is
portable only when the target validator understands the supplied schema, so
this pattern is for TypeBox-aware JavaScript workflows rather than portable
JSON Schema exchange.

## Type.Script

Type.Script parses TypeScript-like syntax into TypeBox schemas. It is useful
for code generation, editor tooling, and externally authored definitions.

```typescript
Type.Script('string')
Type.Script('{ id: number, name?: string }')
Type.Script('{ x: 1 } | { y: 2 }')
Type.Script('keyof { x: number, y: number }')
Type.Script(`{ [K in keyof 'x' | 'y' as Uppercase<K>]?: number }`)
Type.Script('Parameters<(x: number) => number>')
Type.Script('`hello${1|2}`')
```

Use a module map for generics and declarations:

```typescript
const Triple = Type.Script('<T> = [T, T, T]')
const Result = Type.Script({ Triple }, 'Triple<string>')

const { Expression, Literal } = Type.Script(`
  type Expression = Literal | { type: 'binary', left: Expression, right: Expression }
  interface Literal { type: 'literal', value: unknown }
`)
```

Attach schema options with `with`:

```typescript
Type.Script(`string with { format: 'email', description: 'Email address' }`)
```

Supported syntax includes literals, JSON Schema primitives, arrays, tuples,
objects, unions, intersections, functions, constructors, conditionals,
mapped types, indexed access, keyof, utility types, intrinsic string
utilities, generics, and declarations. Template-literal substring infer
and embedded generic function parameters are unsupported.

## Validation

### Compile

Schema.Compile accepts JSON Schema-producing TypeBox builder output,
compatible Type.Script output, and raw JSON Schema. Cache the compiled
validator when the schema is reused:

```typescript
const VectorA = Type.Object({ 
  x: Type.Number(), 
  y: Type.Number() 
})
const VectorB = Type.Script(`{ 
  x: number, 
  y: number 
}`)
const VectorC = {
  type: 'object',
  properties: { 
    x: { type: 'number' }, 
    y: { type: 'number' } 
  },
  required: ['x', 'y']
}

const validatorA = Schema.Compile(VectorA) // From Type.*
const validatorB = Schema.Compile(VectorB) // From Type.Script
const validatorC = Schema.Compile(VectorC) // From JSON Schema

validatorA.Check(value)                    // boolean
validatorA.Parse(value)                    // value or throws
const [valid, errors] = validatorA.Errors(value)
```

### Dynamic

For one-off validation, call the Schema.* functions directly. These
functions accept the same TypeBox, compatible Type.Script, and raw JSON
Schema inputs as Schema.Compile:

```typescript
const Vector = Type.Object({ 
  x: Type.Number(), 
  y: Type.Number() 
})
Schema.Check(Vector, value)   // boolean
Schema.Parse(Vector, value)   // typed value or throws
const [valid, errors] = Schema.Errors(Vector, value)
```

Schema.Compile is JIT-compiled and falls back to dynamic validation in
restricted runtimes. It supports JSON Schema Draft 3 through 2020-12.

Use Value.Check, Value.Parse, and Value.Errors when compilation is not
needed. Unlike Schema.Errors, Value.Errors returns an array of validation
errors rather than a [boolean, errors] tuple. Other value operations include:

```typescript
Value.Default(T, value)
Value.Convert(T, value)
Value.Check(T, value)
Value.Clean(T, value)
Value.Cast(T, value)
Value.Create(T)
Value.Clone(value)
Value.Errors(T, value)
Value.Encode(T, value)
Value.Decode(T, value)
Value.Equal(a, b)
Value.Diff(a, b)
Value.Patch(value, edits)
Value.Hash(value)
Value.Pointer.Get(value, path)
```

Applications should prefer Schema.* validation over Value.* because Value.* 
operations (such as Check and Errors) call through to Schema.* internally. 
The Value submodule is primarily intended for advanced value-processing 
operations, so prefer Schema.* unless such operations are needed.

## Integration

Resolve Type.Static early when it is inferred through deeply generic APIs.
This keeps TypeScript inference tractable:

```typescript
import Type from 'typebox'

// Example Route

type StaticOptional<T> = T extends Type.TSchema ? Type.Static<T> : unknown

type TOptions<
  Input extends Type.TSchema = Type.TSchema,
  Output extends Type.TSchema = Type.TSchema,
> = { input?: Input; output?: Output }

type Callback<Input, Output> = (input: Input) => Output

declare function Route<Path extends string, Options extends TOptions,
  Input extends unknown = StaticOptional<Options['input']>,
  Output extends unknown = StaticOptional<Options['output']>,
  Handler extends Callback<Input, Output> = Callback<Input, Output>,
>(path: Path, options: Options, handler: Handler): { path: Path; handler: Handler }

// Example Usage

Route('/api/echo', {
  input: Type.String(),
  output: Type.String()
}, (input) => input) // type-safe
```

When an input or output schema may be absent, use unknown rather than
assuming a schema exists.

## Upgrading

TypeBox 1.x can consume JSON Schema produced by TypeBox 0.x. This allows an
application to keep its existing 0.x type definitions while adopting the 1.x
compiler and validation APIs. Import the legacy builder and the 1.x schema
module separately:

```typescript
import LegacyType from '@sinclair/typebox' // 0.x
import Schema from 'typebox/schema'        // 1.x

const Vector = Schema.Compile(LegacyType.Object({
  x: LegacyType.Number(),
  y: LegacyType.Number()
}))

const Result = Vector.Parse({ x: 1, y: 2 })
```
