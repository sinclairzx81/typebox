# TypeDef

TypeBox may offer support for [RPC8927](https://www.rfc-editor.org/rfc/rfc8927) JSON Type Definition in future revisions of the library. This specification is much simpler than JSON Schema but can be useful when describing schematics that need to be shared with nominal type languages.

## Usage

The file `typedef.ts` provided with this example contains the provisional implementation for RPC8927.

```typescript
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from './typedef'

const T = Type.Struct('T', {                         // const T = {
  x: Type.Float32(),                                 //   properties: {
  y: Type.Float32(),                                 //     x: { type: "float32" },
  z: Type.Float32()                                  //     y: { type: 'float32' },
})                                                   //     z: { type: 'float32' }
                                                     //   }
                                                     // }

type T = Static<typeof T>                            // type T = {
                                                     //   x: number,
                                                     //   z: number,
                                                     //   y: number
                                                     // }

const R = Value.Check(T, { x: 1, y: 2, z: 3 })       // const R = true
```

### Unions

The JSON Type Definition has a different representation for unions and is primarily orientated towards discriminated unions. To use unions, you will need to name each struct on the first argument. TypeBox will take care of producing the union representation and static type.

```typescript
import { Type, Static } from './typedef'

const Vector2 = Type.Struct('Vector2', {             // const Vector2 = {
  x: Type.Float32(),                                 //   properties: {
  y: Type.Float32(),                                 //     x: { type: 'float32' },
})                                                   //     y: { type: 'float32' }
                                                     //   }
                                                     // }

const Vector3 = Type.Struct('Vector3', {             // const Vector3 = {
  x: Type.Float32(),                                 //   properties: {
  y: Type.Float32(),                                 //     x: { type: 'float32' },
  z: Type.Float32()                                  //     y: { type: 'float32' },
})                                                   //     z: { type: 'float32' }
                                                     //   }
                                                     // }

const Union = Type.Union('type', [                   //  const Union = {
  Vector2,                                           //    discriminator: 'type',
  Vector3                                            //    mapping: {
])                                                   //      Vector2: {
                                                     //        properties: {
                                                     //         x: { type: 'float32' },
                                                     //         y: { type: 'float32' },
                                                     //       }
                                                     //     },
                                                     //     Vector3: {
                                                     //       properties: {
                                                     //         x: { type: 'float32' },
                                                     //         y: { type: 'float32' },
                                                     //         z: { type: 'float32' }
                                                     //       }
                                                     //     }
                                                     //   }
                                                     // }

type Union = Static<typeof Union>                    // type Union = {
                                                     //   type: 'Vector2'
                                                     //   x: number
                                                     //   y: number
                                                     // } | {
                                                     //   type: 'Vector3'
                                                     //   x: number
                                                     //   y: number
                                                     //   z: number
                                                     // }    
```
