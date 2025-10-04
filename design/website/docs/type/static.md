# Static

The Static type infers TypeBox and Json Schema schematics.

```typescript
const T = Type.Number()

type T = Static<typeof T>                           // type T = number
```

## Remarks

The Static can be used to infer raw Json Schema.

### Json Schema

```typescript
const T = { oneOf: [{ const: 1 }, { const: 2 }] } as const

type T = Static<typeof T>                           // type T = 1 | 2
```