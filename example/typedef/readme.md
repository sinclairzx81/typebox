# JSON Type Definition

[JSON Type Definition](https://jsontypedef.com/) is a alternative schema specification that defines a set of schematics more inline with the needs of nominal type systems. This example shows how to extend the TypeBox Type Builder to support this specification.

## TypeDef

The file `typedef.ts` provided with this example contains the full implementation. The following shows it's use.

```typescript
import { TypeDef as Type, Static } from './typedef'
import { Value } from '@sinclair/typebox/value'

const T = Type.Object({
  x: Type.Float32(),
  y: Type.Float32(),
  z: Type.Float32()
})

type T = Static<typeof T>                            // type T = {
                                                     //   x: number,
                                                     //   z: number,
                                                     //   y: number
                                                     // }

const R = Value.Check(T, { x: 1, y: 2, z: 3 })       // const R = true
```

```typescript
export type UnionType = Static<typeof UnionType>
export const UnionType = TypeDef.Union('eventType', {
  USER_CREATED: TypeDef.Properties({
    id: TypeDef.String(),
  }),
  USER_PAYMENT_PLAN_CHANGED: TypeDef.Properties({
    id: TypeDef.String(),
    plan: TypeDef.Enum(['FREE', 'PAID']),
  }),
  USER_DELETED: TypeDef.Properties({
    id: TypeDef.String(),
    softDelete: TypeDef.Boolean(),
  }),
})
```
