# TypeDef

TypeBox is considering support for the JSON Type Definition [RFC8927](https://www.rfc-editor.org/rfc/rfc8927) specification in future releases. This specification is similar to JSON Schema but provides a constrained type representation that enables schematics to map more naturally to [nominal type systems](https://en.wikipedia.org/wiki/Nominal_type_system) as well as offering type primitives such as `int8`, `uint32` or `float32`. JSON Type Definition can be useful in applications that need to express and share data structures in a way that can be understood by a wide range of programming languages outside of JavaScript.

License MIT

## Contents
- [Usage](#Usage)
- [Types](#Types)
- [Unions](#Unions)
- [Check](#Check)

## Usage

TypeBox currently doesn't publish TypeDef as part of the mainline package. However the TypeDef functionality is written to be a standalone module you can copy into your project. You will also need `@sinclair/typebox` installed. You can obtain the `typedef` module from `example/typedef/typedef.ts` contained within this repository. 

```typescript
import { Type, Static } from './typedef'

const T = Type.Struct({                // const T = {
  x: Type.Float32(),                   //   properties: {
  y: Type.Float32(),                   //     x: { type: 'float32' },
  z: Type.Float32()                    //     y: { type: 'float32' },
})                                     //     z: { type: 'float32' }
                                       //   }
                                       // }

type T = Static<typeof T>              // type T = {
                                       //   x: number,
                                       //   y: number,
                                       //   z: number
                                       // }
```

## Types

The following types are supported by the typedef module. Please note these types are not compatible with the JSON Schema specification and should not be combined with the standard TypeBox types.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ JSON Type Definition           │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Boolean()       │ type T = boolean            │ const T = {                    │
│                                │                             │   type: 'boolean'              │
│                                │                             │ }                              │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.String()        │ type T = string             │ const T = {                    │
│                                │                             │   type: 'string'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Float32()       │ type T = number             │ const T = {                    │
│                                │                             │   type: 'float32'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Float64()       │ type T = number             │ const T = {                    │
│                                │                             │   type: 'float64'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Int8()          │ type T = number             │ const T = {                    │
│                                │                             │   type: 'int8'                 │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Int16()         │ type T = number             │ const T = {                    │
│                                │                             │   type: 'int16'                │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Int32()         │ type T = number             │ const T = {                    │
│                                │                             │   type: 'int32'                │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uint8()         │ type T = number             │ const T = {                    │
│                                │                             │   type: 'uint8'                │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uint16()        │ type T = number             │ const T = {                    │
│                                │                             │   type: 'uint16'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uint32()        │ type T = number             │ const T = {                    │
│                                │                             │   type: 'uint32'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Timestamp()     │ type T = number             │ const T = {                    │
│                                │                             │   type: 'timestamp'            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Struct([        │ type T = {                  │ const T = {                    │
│   x: Type.Float32(),           │   x: number,                │   properties: {                │
│   y: Type.Float32(),           │   y: number                 │     x: number,                 │
│ ])                             │ }                           │     y: number                  │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Array(          │ type T = number[]           │ const T = {                    │
│   Type.Float32()               │                             │   elements: {                  │
│ )                              │                             │     type: 'float32'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Record(         │ type T = Record<            │ const T = {                    │
│   Type.Float32()               │   string,                   │   values: {                    │
│ )                              │   number                    │     type: 'float32'            │
│                                │ >                           │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Enum([          │ type T = 'A' | 'B' | 'C'    │ const T = {                    │
│   'A', 'B', 'C'                │                             │   enum: [                      │
│ ])                             │                             │     'A',                       │
│                                │                             │     'B',                       │
│                                │                             │     'C'                        │
│                                │                             │   ]                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Union([         │ type T = {                  │ const T = {                    │
│   Type.Struct({                │   kind: '0',                │   discriminator: 'kind',       │
│     x: Type.Float32()          │   x: number                 │   mapping: {                   │
│   }),                          │ } | {                       │     '0': {                     │
│   Type.Struct({                │   kind: '1'                 │       properties: {            │
│     y: Type.Float32()          │   y: number                 │         x: {                   │
│   ])                           │ }                           │           type: 'float32'      │
│ ], 'kind')                     │                             │         }                      │
│                                │                             │       }                        │
│                                │                             │     },                         │
│                                │                             │     '1':  {                    |
│                                │                             │       properties: {            │
│                                │                             │         y: {                   │
│                                │                             │           type: 'float32'      │
│                                │                             │         }                      │
│                                │                             │       }                        │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

## Unions

TypeBox supports JSON Type Definition discriminated unions with `Type.Union`. This type works similar its JSON Schema counterpart, but can only accept types of `Type.Struct` and will infer each struct with an additional named `discriminator` field. The representation for discriminated unions are also quite different, where instead of `anyOf` or `oneOf`, a set of  `mapping` properties are used for each sub type.

```typescript
const Vector2 = Type.Struct({          // const Vector2 = {
  x: Type.Float32(),                   //   properties: {
  y: Type.Float32()                    //     x: { type: 'float32' },
})                                     //     y: { type: 'float32' }
                                       //   }
                                       // }

const Vector3 = Type.Struct({          // const Vector3 = {
  x: Type.Float32(),                   //   properties: {
  y: Type.Float32(),                   //     x: { type: 'float32' },
  z: Type.Float32()                    //     y: { type: 'float32' },
})                                     //     z: { type: 'float32' }
                                       //   }
                                       // }

const Vector4 = Type.Struct({          // const Vector4 = {
  x: Type.Float32(),                   //   properties: {
  y: Type.Float32(),                   //     x: { type: 'float32' },
  z: Type.Float32(),                   //     y: { type: 'float32' },
  w: Type.Float32()                    //     z: { type: 'float32' },
})                                     //     w: { type: 'float32' }
                                       //   }
                                       // }

const T = Type.Union([                 // const T = {
  Vector2,                             //   discriminator: 'type',
  Vector3,                             //   mapping: {
  Vector4                              //     0: {
])                                     //       properties: {
                                       //         x: { type: 'float32' },
                                       //         y: { type: 'float32' }
                                       //       }
                                       //     },
                                       //     1: {
                                       //       properties: {
                                       //         x: { type: 'float32' },
                                       //         y: { type: 'float32' },
                                       //         z: { type: 'float32' }
                                       //       }
                                       //     },
                                       //     2: {
                                       //       properties: {
                                       //         x: { type: 'float32' },
                                       //         y: { type: 'float32' },
                                       //         z: { type: 'float32' }
                                       //       } 
                                       //     }
                                       //   }
                                       // }


type T = Static<typeof T>              // type T = {
                                       //   type: '0',
                                       //   x: number,
                                       //   y: number
                                       // } | {
                                       //   type: '1',
                                       //   x: number,
                                       //   y: number,
                                       //   y: number
                                       // } | {
                                       //   type: '2',
                                       //   x: number,
                                       //   y: number,
                                       //   y: number,
                                       //   w: number
                                       // }
```
To type check a value matching the above union, the value will need to contain the discriminator property `type` with a value matching one of the sub type `mapping` keys. The inference type shown above can be a good reference point to understand the structure of the expected value. Nominal type systems will use the discriminator to an expected target type.

The following are examples of valid and invalid union data.

```typescript

const V = { x: 1, y: 1 }                    // invalid Vector2

const V = { type: '0', x: 1, y: 1 }         // valid Vector2

const V = { type: '0', x: 1, y: 1, z: 1 }   // invalid Vector2

const V = { type: '1', x: 1, y: 1, z: 1 }   // valid Vector3
```


## Check

TypeDef types are partially supported with the `TypeCompiler` and `Value` checking modules through the extensible type system in TypeBox. Please note these types are not optimized for JIT performance and do not provide deep error reporting support. For more fully featured validation support consider Ajv. Documentation of Ajv support can be found [here](https://ajv.js.org/json-type-definition.html).

The following is TypeDef used with TypeBox's type checking infrastructure.

```typescript
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'

const T = Type.Struct({
  x: Type.Float32(),
  y: Type.Float32(),
  z: Type.Float32()
})

const V = {
  x: 1,
  y: 2,
  z: 3
}

const R1 = TypeCompiler.Compile(T).Check(V)      // true

const R2 = Value.Check(T, V)                     // true
```