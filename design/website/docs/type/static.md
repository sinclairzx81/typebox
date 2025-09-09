# Static

The Static type infers TypeBox, Json Schema and Standard Schema schematics.

```typescript
const T = Type.Number()

type T = Static<typeof T>                           // type T = number
```

## Remarks

The Static can be used to infer raw Json Schema as well as types from remote Standard Schema libraries.

### Json Schema

```typescript
const T = { oneOf: [{ const: 1 }, { const: 2 }] } as const

type T = Static<typeof T>                           // type T = 1 | 2
```

### Standard Schema

```typescript
import * as z from 'zod'

const T = z.union([z.literal(1), z.literal(2)])

type T = Static<typeof T>                           // type T = 1 | 2
```