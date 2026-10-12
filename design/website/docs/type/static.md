# Type.Static

The `Static` type infers a TypeScript type from a TypeBox type or JSON Schema.

## Example

```typescript
const T = Type.Number()

type T = Static<typeof T>                           // type T = number
```

## Remarks

The `Static` type can also infer a TypeScript type from raw JSON Schema.

### JSON Schema

```typescript
const T = { oneOf: [{ const: 1 }, { const: 2 }] } as const

type T = Static<typeof T>                           // type T = 1 | 2
```