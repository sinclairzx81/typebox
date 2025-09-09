# TypeBox

A Runtime Type System for JavaScript

## Overview

TypeBox is a runtime type system that creates in-memory Json Schema objects that infer as TypeScript types. The schemas produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type that can be statically checked by TypeScript and runtime checked with Json Schema.

TypeBox is designed to bring TypeScript level programmability to Json Schema and to offer a high performance validation solution for JavaScript. It can be used as a simple tool to build up complex schema or integrated into REST and RPC services to help validate data received over the wire.

## Features

## Type

The Type namespace creates Json Schema.

```typescript
import Type, { type Static } from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```

## Script

The Script creates Json Schema from TypeScript syntax.

```typescript
import Type, { type Static } from 'typebox'

const T = Type.Script(`{
  x: number
  y: number
  z: number
}`)

type T = Static<typeof T>                           // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }

const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)

type S = Static<typeof S>                           // type S = {
                                                    //   x: number | null,
                                                    //   y: number | null,
                                                    //   z: number | null
                                                    // }
```

## Compile

The Compile module compiles high-performance validators.

```typescript
import { Compile } from 'typebox/compile'

const C = Compile(Type.Script(`{
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