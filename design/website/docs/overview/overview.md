# TypeBox

JSON Schema Type Builder with Static Type Resolution for TypeScript

## Overview

TypeBox is a runtime type system that creates in-memory JSON Schema objects that infer as TypeScript types. The schematics produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type that can be statically checked by TypeScript and runtime checked using standard JSON Schema validation.

This library is designed to allow JSON Schema to compose similar to how types compose within TypeScript's type system. It can be used as a simple tool to build up complex schematics or integrated into REST and RPC services to help validate data received over the wire.

## Type

The Type namespace creates JSON Schema.

```typescript
import Type from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Type.Static<typeof T>                      // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```

## Script

The Script creates JSON Schema from TypeScript syntax.

```typescript
import Type from 'typebox'

const T = Type.Script(`{
  x: number
  y: number
  z: number
}`)

type T = Type.Static<typeof T>                      // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }

const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)

type S = Type.Static<typeof S>                      // type S = {
                                                    //   x: number | null,
                                                    //   y: number | null,
                                                    //   z: number | null
                                                    // }
```

## Schema

The Schema module compiles schematics into high-performance validators.

```typescript
import Type from 'typebox'
import Schema from 'typebox/schema'

const C = Schema.Compile(Type.Script(`{
  x: number
  y: number
  z: number
}`))

const R = C.Parse(...)                              // const R: {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...
```