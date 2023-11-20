<div align='center'>

<h1>TypeBox</h1>

<p>Json Schema Type Builder with Static Type Resolution for TypeScript</p>

<img src="https://github.com/sinclairzx81/typebox/blob/master/typebox.png?raw=true" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox.svg)](https://badge.fury.io/js/%40sinclair%2Ftypebox)
[![Downloads](https://img.shields.io/npm/dm/%40sinclair%2Ftypebox.svg)](https://www.npmjs.com/package/%40sinclair%2Ftypebox)
[![Build](https://github.com/sinclairzx81/typebox/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typebox/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<a name="Install"></a>

## Install

#### Npm
```bash
$ npm install @sinclair/typebox --save
```

#### Esm + Deno

```typescript
import { Type, Static } from 'https://esm.sh/@sinclair/typebox'
```

## Example

```typescript
import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({                              // const T = {
  x: Type.Number(),                                  //   type: 'object',
  y: Type.Number(),                                  //   required: ['x', 'y', 'z'],
  z: Type.Number()                                   //   properties: {
})                                                   //     x: { type: 'number' },
                                                     //     y: { type: 'number' },
                                                     //     z: { type: 'number' }
                                                     //   }
                                                     // }

type T = Static<typeof T>                            // type T = {
                                                     //   x: number,
                                                     //   y: number,
                                                     //   z: number
                                                     // }
```


<a name="Overview"></a>

## Overview

TypeBox is a runtime type builder that creates in-memory JSON Schema objects that can be statically inferred as TypeScript types. The schemas produced by this library are designed to match the static type assertion rules of the TypeScript compiler. TypeBox enables one to create a unified type that can be statically checked by TypeScript and runtime asserted using standard JSON Schema validation.

This library is designed to enable JSON schema to compose with the same flexibility as TypeScript's type system. It can be used as a simple tool to build up complex schemas or integrated into REST or RPC services to help validate data received over the wire.

License MIT

## Contents
- [Install](#install)
- [Overview](#overview)
- [Usage](#usage)
- [Types](#types)
  - [Json](#types-json)
  - [JavaScript](#types-javascript)
  - [Options](#types-options)
  - [Properties](#types-properties)
  - [Generics](#types-generics)
  - [References](#types-references)
  - [Recursive](#types-recursive)
  - [Conditional](#types-conditional)
  - [Template Literal](#types-templateliteral)
  - [Indexed](#types-indexed)
  - [Rest](#types-rest)
  - [Transform](#types-transform)
  - [Intrinsic](#types-intrinsic)
  - [Guard](#types-guard)
  - [Unsafe](#types-unsafe)
  - [Strict](#types-strict)
- [Values](#values)
  - [Create](#values-create)
  - [Clone](#values-clone)
  - [Check](#values-check)
  - [Convert](#values-convert)
  - [Cast](#values-cast)
  - [Decode](#values-decode)
  - [Encode](#values-decode)
  - [Equal](#values-equal)
  - [Hash](#values-hash)
  - [Diff](#values-diff)
  - [Patch](#values-patch)
  - [Errors](#values-errors)
  - [Mutate](#values-mutate)
  - [Pointer](#values-pointer)
- [TypeRegistry](#typeregistry)
  - [Type](#typeregistry-type)
  - [Format](#typeregistry-format)
- [TypeCheck](#typecheck)
  - [Ajv](#typecheck-ajv)
  - [TypeCompiler](#typecheck-typecompiler)
- [TypeSystem](#typesystem)
  - [Types](#typesystem-types)
  - [Formats](#typesystem-formats)
  - [Errors](#typesystem-errors)
  - [Policies](#typesystem-policies)
- [Workbench](#workbench)
- [Codegen](#codegen)
- [Ecosystem](#ecosystem)
- [Benchmark](#benchmark)
  - [Compile](#benchmark-compile)
  - [Validate](#benchmark-validate)
  - [Compression](#benchmark-compression)
- [Contribute](#contribute)

<a name="usage"></a>

## Usage

The following shows general usage.

```typescript
import { Type, Static } from '@sinclair/typebox'

//--------------------------------------------------------------------------------------------
//
// Let's say you have the following type ...
//
//--------------------------------------------------------------------------------------------

type T = {
  id: string,
  name: string,
  timestamp: number
}

//--------------------------------------------------------------------------------------------
//
// ... you can express this type in the following way.
//
//--------------------------------------------------------------------------------------------

const T = Type.Object({                              // const T = {
  id: Type.String(),                                 //   type: 'object',
  name: Type.String(),                               //   properties: {
  timestamp: Type.Integer()                          //     id: {
})                                                   //       type: 'string'
                                                     //     },
                                                     //     name: {
                                                     //       type: 'string'
                                                     //     },
                                                     //     timestamp: {
                                                     //       type: 'integer'
                                                     //     }
                                                     //   },
                                                     //   required: [
                                                     //     'id',
                                                     //     'name',
                                                     //     'timestamp'
                                                     //   ]
                                                     // }

//--------------------------------------------------------------------------------------------
//
// ... then infer back to the original static type this way.
//
//--------------------------------------------------------------------------------------------

type T = Static<typeof T>                            // type T = {
                                                     //   id: string,
                                                     //   name: string,
                                                     //   timestamp: number
                                                     // }

//--------------------------------------------------------------------------------------------
//
// ... then use the type both as Json Schema and as a TypeScript type.
//
//--------------------------------------------------------------------------------------------

import { Value } from '@sinclair/typebox/value'

function receive(value: T) {                         // ... as a Static Type

  if(Value.Check(T, value)) {                        // ... as a Json Schema

    // ok...
  }
}
```

<a name='types'></a>

## Types

TypeBox types are Json Schema fragments that compose into more complex types. Each fragment is structured such that any Json Schema compliant validator can runtime assert a value the same way TypeScript will statically assert a type. TypeBox offers a set of Json Types which are used to create Json Schema compliant schematics as well as a JavaScript type set used to create schematics for constructs native to JavaScript.

<a name='types-json'></a>

### Json Types

The following table lists the supported Json types. These types are fully compatible with the Json Schema Draft 7 specification.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ Json Schema                    │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Any()           │ type T = any                │ const T = { }                  │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Unknown()       │ type T = unknown            │ const T = { }                  │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.String()        │ type T = string             │ const T = {                    │
│                                │                             │   type: 'string'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Number()        │ type T = number             │ const T = {                    │
│                                │                             │   type: 'number'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Integer()       │ type T = number             │ const T = {                    │
│                                │                             │   type: 'integer'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Boolean()       │ type T = boolean            │ const T = {                    │
│                                │                             │   type: 'boolean'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Null()          │ type T = null               │ const T = {                    │
│                                │                             │   type: 'null'                 │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Literal(42)     │ type T = 42                 │ const T = {                    │
│                                │                             │   const: 42,                   │
│                                │                             │   type: 'number'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Array(          │ type T = number[]           │ const T = {                    │
│   Type.Number()                │                             │   type: 'array',               │
│ )                              │                             │   items: {                     │
│                                │                             │     type: 'number'             │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   x: Type.Number(),            │   x: number,                │   type: 'object',              │
│   y: Type.Number()             │   y: number                 │   required: ['x', 'y'],        │
│ })                             │ }                           │   properties: {                │
│                                │                             │     x: {                       │
│                                │                             │       type: 'number'           │
│                                │                             │     },                         │
│                                │                             │     y: {                       │
│                                │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Tuple([         │ type T = [number, number]   │ const T = {                    │
│   Type.Number(),               │                             │   type: 'array',               │
│   Type.Number()                │                             │   items: [{                    │
│ ])                             │                             │     type: 'number'             │
│                                │                             │   }, {                         │
│                                │                             │     type: 'number'             │
│                                │                             │   }],                          │
│                                │                             │   additionalItems: false,      │
│                                │                             │   minItems: 2,                 │
│                                │                             │   maxItems: 2                  │
│                                │                             │ }                              │
│                                │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ enum Foo {                     │ enum Foo {                  │ const T = {                    │
│   A,                           │   A,                        │   anyOf: [{                    │
│   B                            │   B                         │     type: 'number',            │
│ }                              │ }                           │     const: 0                   │
│                                │                             │   }, {                         │
│ const T = Type.Enum(Foo)       │ type T = Foo                │     type: 'number',            │
│                                │                             │     const: 1                   │
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.KeyOf(          │ type T = keyof {            │ const T = {                    │
│   Type.Object({                │   x: number,                │   anyOf: [{                    │
│     x: Type.Number(),          │   y: number                 │     type: 'string',            │
│     y: Type.Number()           │ }                           │     const: 'x'                 │
│   })                           │                             │   }, {                         │
│ )                              │                             │     type: 'string',            │
│                                │                             │     const: 'y'                 │
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Union([         │ type T = string | number    │ const T = {                    │
│   Type.String(),               │                             │   anyOf: [{                    │
│   Type.Number()                │                             │     type: 'string'             │
│ ])                             │                             │   }, {                         │
│                                │                             │     type: 'number'             │
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Intersect([     │ type T = {                  │ const T = {                    │
│   Type.Object({                │   x: number                 │   allOf: [{                    │
│     x: Type.Number()           │ } & {                       │     type: 'object',            │
│   }),                          │   y: number                 │     required: ['x'],           │
│   Type.Object({                │ }                           │     properties: {              │
│     y: Type.Number()           │                             │       x: {                     │
│   ])                           │                             │         type: 'number'         │
│ ])                             │                             │       }                        │
│                                │                             │     }                          │
│                                │                             │   }, {                         │
│                                │                             │     type: 'object',            |
│                                │                             │     required: ['y'],           │
│                                │                             │     properties: {              │
│                                │                             │       y: {                     │
│                                │                             │         type: 'number'         │
│                                │                             │       }                        │
│                                │                             │     }                          │
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Composite([     │ type T = {                  │ const T = {                    │
│   Type.Object({                │   x: number,                │   type: 'object',              │
│     x: Type.Number()           │   y: number                 │   required: ['x', 'y'],        │
│   }),                          │ }                           │   properties: {                │
│   Type.Object({                │                             │     x: {                       │
│     y: Type.Number()           │                             │       type: 'number'           │
│   })                           │                             │     },                         │
│ ])                             │                             │     y: {                       │
│                                │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Never()         │ type T = never              │ const T = {                    │
│                                │                             │   not: {}                      │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Not(            | type T = unknown            │ const T = {                    │
│   Type.String()                │                             │   not: {                       │
│ )                              │                             │     type: 'string'             │
│                                │                             │   }                            │
│                                │                             │ }                              │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Extends(        │ type T =                    │ const T = {                    │
│   Type.String(),               │  string extends number      │   const: false,                │
│   Type.Number(),               │  true : false               │   type: 'boolean'              │
│   Type.Literal(true),          │                             │ }                              │
│   Type.Literal(false)          │                             │                                │
│ )                              │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Extract(        │ type T = Extract<           │ const T = {                    │
│   Type.Union([                 │   string | number,          │   type: 'string'               │
│     Type.String(),             │   string                    │ }                              │
│     Type.Number(),             │ >                           │                                │
│   ]),                          │                             │                                │
│   Type.String()                │                             │                                │
│ )                              │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Exclude(        │ type T = Exclude<           │ const T = {                    │
│   Type.Union([                 │   string | number,          │   type: 'number'               │
│     Type.String(),             │   string                    │ }                              │
│     Type.Number(),             │ >                           │                                │
│   ]),                          │                             │                                │
│   Type.String()                │                             │                                │
│ )                              │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const U = Type.Union([         │ type U = 'open' | 'close'   │ const T = {                    │
│   Type.Literal('open'),        │                             │   type: 'string',              │
│   Type.Literal('close')        │ type T = `on${U}`           │   pattern: '^on(open|close)$'  │
│ ])                             │                             │ }                              │
│                                │                             │                                │
│ const T = Type                 │                             │                                │
│   .TemplateLiteral([           │                             │                                │
│      Type.Literal('on'),       │                             │                                │
│      U                         │                             │                                │
│   ])                           │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Record(         │ type T = Record<            │ const T = {                    │
│   Type.String(),               │   string,                   │   type: 'object',              │
│   Type.Number()                │   number                    │   patternProperties: {         │
│ )                              │ >                           │     '^.*$': {                  │
│                                │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Partial(        │ type T = Partial<{          │ const T = {                    │
│   Type.Object({                │   x: number,                │   type: 'object',              │
│     x: Type.Number(),          │   y: number                 │   properties: {                │
│     y: Type.Number()           | }>                          │     x: {                       │
│   })                           │                             │       type: 'number'           │
│ )                              │                             │     },                         │
│                                │                             │     y: {                       │
│                                │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Required(       │ type T = Required<{         │ const T = {                    │
│   Type.Object({                │   x?: number,               │   type: 'object',              │
│     x: Type.Optional(          │   y?: number                │   required: ['x', 'y'],        │
│       Type.Number()            | }>                          │   properties: {                │
│     ),                         │                             │     x: {                       │
│     y: Type.Optional(          │                             │       type: 'number'           │
│       Type.Number()            │                             │     },                         │
│     )                          │                             │     y: {                       │
│   })                           │                             │       type: 'number'           │
│ )                              │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Pick(           │ type T = Pick<{             │ const T = {                    │
│   Type.Object({                │   x: number,                │   type: 'object',              │
│     x: Type.Number(),          │   y: number                 │   required: ['x'],             │
│     y: Type.Number()           │ }, 'x'>                     │   properties: {                │
│   }), ['x']                    |                             │     x: {                       │
│ )                              │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Omit(           │ type T = Omit<{             │ const T = {                    │
│   Type.Object({                │   x: number,                │   type: 'object',              │
│     x: Type.Number(),          │   y: number                 │   required: ['y'],             │
│     y: Type.Number()           │ }, 'x'>                     │   properties: {                │
│   }), ['x']                    |                             │     y: {                       │
│ )                              │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Index(          │ type T = {                  │ const T = {                    │
│   Type.Object({                │   x: number,                │   type: 'number'               │
│     x: Type.Number(),          │   y: string                 │ }                              │
│     y: Type.String()           │ }['x']                      │                                │
│   }), ['x']                    │                             │                                │
│ )                              │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const A = Type.Tuple([         │ type A = [0, 1]             │ const T = {                    │
│   Type.Literal(0),             │ type B = [2, 3]             │   type: 'array',               │
│   Type.Literal(1)              │ type T = [                  │   items: [                     │
│ ])                             │   ...A,                     │     { const: 0 },              │
│ const B = Type.Tuple([         │   ...B                      │     { const: 1 },              │
|   Type.Literal(2),             │ ]                           │     { const: 2 },              │
|   Type.Literal(3)              │                             │     { const: 3 }               │
│ ])                             │                             │   ],                           │
│ const T = Type.Tuple([         │                             │   additionalItems: false,      │
|   ...Type.Rest(A),             │                             │   minItems: 4,                 │
|   ...Type.Rest(B)              │                             │   maxItems: 4                  │
│ ])                             │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uncapitalize(   │ type T = Uncapitalize<      │ const T = {                    │
│   Type.Literal('Hello')        │   'Hello'                   │   type: 'string',              │
│ )                              │ >                           │   const: 'hello'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Capitalize(     │ type T = Capitalize<        │ const T = {                    │
│   Type.Literal('hello')        │   'hello'                   │   type: 'string',              │
│ )                              │ >                           │   const: 'Hello'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uppercase(      │ type T = Uppercase<         │ const T = {                    │
│   Type.Literal('hello')        │   'hello'                   │   type: 'string',              │
│ )                              │ >                           │   const: 'HELLO'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Lowercase(      │ type T = Lowercase<         │ const T = {                    │
│   Type.Literal('HELLO')        │   'HELLO'                   │   type: 'string',              │
│ )                              │ >                           │   const: 'hello'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const R = {                    │
│    x: Type.Number(),           │   x: number,                │   $ref: 'T'                    │
│    y: Type.Number()            │   y: number                 │ }                              │
│ }, { $id: 'T' })               | }                           │                                │
│                                │                             │                                │
│ const R = Type.Ref(T)          │ type R = T                  │                                │
│                                │                             │                                │
│                                │                             │                                │
│                                │                             │                                │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name='types-javascript'></a>

### JavaScript Types

TypeBox provides an extended type set that can be used to create schematics for common JavaScript constructs. These types can not be used with any standard Json Schema validator; but can be used to frame schematics for interfaces that may receive Json validated data. JavaScript types are prefixed with the `[JavaScript]` jsdoc comment for convenience. The following table lists the supported types.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ Extended Schema                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Constructor([   │ type T = new (              │ const T = {                    │
│   Type.String(),               │  arg0: string,              │   type: 'Constructor',         │
│   Type.Number()                │  arg0: number               │   parameters: [{               │
│ ], Type.Boolean())             │ ) => boolean                │     type: 'string'             │
│                                │                             │   }, {                         │
│                                │                             │     type: 'number'             │
│                                │                             │   }],                          │
│                                │                             │   returns: {                   │
│                                │                             │     type: 'boolean'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Function([      │ type T = (                  │ const T = {                    │
|   Type.String(),               │  arg0: string,              │   type: 'Function',            │
│   Type.Number()                │  arg1: number               │   parameters: [{               │
│ ], Type.Boolean())             │ ) => boolean                │     type: 'string'             │
│                                │                             │   }, {                         │
│                                │                             │     type: 'number'             │
│                                │                             │   }],                          │
│                                │                             │   returns: {                   │
│                                │                             │     type: 'boolean'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Promise(        │ type T = Promise<string>    │ const T = {                    │
│   Type.String()                │                             │   type: 'Promise',             │
│ )                              │                             │   item: {                      │
│                                │                             │     type: 'string'             │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T =                      │ type T =                    │ const T = {                    │
│   Type.AsyncIterator(          │   AsyncIterableIterator<    │   type: 'AsyncIterator',       │
│     Type.String()              │    string                   │   items: {                     │
│   )                            │   >                         │     type: 'string'             │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Iterator(       │ type T =                    │ const T = {                    │
│   Type.String()                │   IterableIterator<string>  │   type: 'Iterator',            │
│ )                              │                             │   items: {                     │
│                                │                             │     type: 'string'             │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.RegExp(/abc/)   │ type T = string             │ const T = {                    │
│                                │                             │   type: 'string'               │
│                                │                             │   pattern: 'abc'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uint8Array()    │ type T = Uint8Array         │ const T = {                    │
│                                │                             │   type: 'Uint8Array'           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Date()          │ type T = Date               │ const T = {                    │
│                                │                             │   type: 'Date'                 │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Undefined()     │ type T = undefined          │ const T = {                    │
│                                │                             │   type: 'undefined'            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Symbol()        │ type T = symbol             │ const T = {                    │
│                                │                             │   type: 'symbol'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.BigInt()        │ type T = bigint             │ const T = {                    │
│                                │                             │   type: 'bigint'               │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Void()          │ type T = void               │ const T = {                    │
│                                │                             │   type: 'void'                 │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name='types-options'></a>

### Options

You can pass Json Schema options on the last argument of any type. Option hints specific to each type are provided for convenience.

```typescript
// String must be an email
const T = Type.String({                              // const T = {
  format: 'email'                                    //   type: 'string',
})                                                   //   format: 'email'
                                                     // }

// Number must be a multiple of 2
const T = Type.Number({                              // const T = {
  multipleOf: 2                                      //  type: 'number',
})                                                   //  multipleOf: 2
                                                     // }

// Array must have at least 5 integer values
const T = Type.Array(Type.Integer(), {               // const T = {
  minItems: 5                                        //   type: 'array',
})                                                   //   minItems: 5,
                                                     //   items: {
                                                     //     type: 'integer'
                                                     //   }
                                                     // }
```

<a name='types-properties'></a>

### Properties

Object properties can be modified with Readonly and Optional. The following table shows how these modifiers map between TypeScript and Json Schema.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ Json Schema                    │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.ReadonlyOptional( │   readonly name?: string    │   type: 'object',              │
│     Type.String()              │ }                           │   properties: {                │
│   )                            │                             │     name: {                    │
│ })  	                         │                             │       type: 'string'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.Readonly(         │   readonly name: string     │   type: 'object',              │
│     Type.String()              │ }                           │   properties: {                │
│   )                            │                             │     name: {                    │
│ })  	                         │                             │       type: 'string'           │
│                                │                             │     }                          │
│                                │                             │   },                           │
│                                │                             │   required: ['name']           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.Optional(         │   name?: string             │   type: 'object',              │
│     Type.String()              │ }                           │   properties: {                │
│   )                            │                             │     name: {                    │
│ })  	                         │                             │       type: 'string'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```
<a name='types-generics'></a>

### Generic Types

Generic types can be created with generic functions. All types extend the base type TSchema. It is common to constrain generic function arguments to this type. The following creates a generic Vector type.

```typescript
import { Type, Static, TSchema } from '@sinclair/typebox'

const Vector = <T extends TSchema>(t: T) => Type.Object({ x: t, y: t, z: t })

const NumberVector = Vector(Type.Number())           // const NumberVector = {
                                                     //   type: 'object',
                                                     //   required: ['x', 'y', 'z'],
                                                     //   properties: {
                                                     //     x: { type: 'number' },
                                                     //     y: { type: 'number' },
                                                     //     z: { type: 'number' }
                                                     //   }
                                                     // }

type NumberVector = Static<typeof NumberVector>      // type NumberVector = {
                                                     //   x: number,
                                                     //   y: number,
                                                     //   z: number
                                                     // }
```

Generic types are often used to create aliases for more complex types. The following creates a Nullable generic type.

```typescript
const Nullable = <T extends TSchema>(schema: T) => Type.Union([schema, Type.Null()])

const T = Nullable(Type.String())                    // const T = {
                                                     //   anyOf: [
                                                     //     { type: 'string' },
                                                     //     { type: 'null' }
                                                     //   ]
                                                     // }

type T = Static<typeof T>                            // type T = string | null
```

<a name='types-references'></a>

### Reference Types

Reference types are supported with Ref.

```typescript
const T = Type.String({ $id: 'T' })                  // const T = {
                                                     //   $id: 'T',
                                                     //   type: 'string'
                                                     // } 

const R = Type.Ref<typeof T>('T')                    // const R = {
                                                     //   $ref: 'T'
                                                     // }

type R = Static<typeof R>                            // type R = string
```

<a name='types-recursive'></a>

### Recursive Types

TypeBox supports singular recursive data structures. Recursive type inference is also supported. The following creates a recursive Node data structure.

```typescript
const Node = Type.Recursive(This => Type.Object({    // const Node = {
  id: Type.String(),                                 //   $id: 'Node',
  nodes: Type.Array(This)                            //   type: 'object',
}), { $id: 'Node' })                                 //   properties: {
                                                     //     id: {
                                                     //       type: 'string'
                                                     //     },
                                                     //     nodes: {
                                                     //       type: 'array',
                                                     //       items: {
                                                     //         $ref: 'Node'
                                                     //       }
                                                     //     }
                                                     //   },
                                                     //   required: [
                                                     //     'id',
                                                     //     'nodes'
                                                     //   ]
                                                     // }

type Node = Static<typeof Node>                      // type Node = {
                                                     //   id: string
                                                     //   nodes: Node[]
                                                     // }

function test(node: Node) {
  const id = node.nodes[0].nodes[0].id               // id is string
}
```

<a name='types-conditional'></a>

### Conditional Types

TypeBox supports runtime conditional types with Extends. This type will perform a structural assignability check for the first two arguments and returns one of the second two arguments based on the result. The Extends type is modelled after TypeScript conditional types. The Exclude and Extract conditional types are also supported.

```typescript
// TypeScript

type T0 = string extends number ? true : false       // type T0 = false

type T1 = Extract<(1 | 2 | 3), 1>                    // type T1 = 1

type T2 = Exclude<(1 | 2 | 3), 1>                    // type T2 = 2 | 3

// TypeBox

const T0 = Type.Extends(                             // const T0: TLiteral<false> = {
  Type.String(),                                     //   type: 'boolean',
  Type.Number(),                                     //   const: false
  Type.Literal(true),                                // }
  Type.Literal(false)
)

const T1 = Type.Extract(                             // const T1: TLiteral<1> = {
  Type.Union([                                       //   type: 'number',
    Type.Literal(1),                                 //   const: 1
    Type.Literal(2),                                 // }
    Type.Literal(3) 
  ]), 
  Type.Literal(1)
)

const T2 = Type.Exclude(                             // const T2: TUnion<[
  Type.Union([                                       //   TLiteral<2>,
    Type.Literal(1),                                 //   TLiteral<3>
    Type.Literal(2),                                 // ]> = {
    Type.Literal(3)                                  //   anyOf: [{
  ]),                                                //     type: 'number',
  Type.Literal(1)                                    //     const: 2
)                                                    //   }, {
                                                     //     type: 'number',
                                                     //     const: 3
                                                     //   }]
                                                     // }
```

<a name='types-templateliteral'></a>

### Template Literal Types

TypeBox supports template literal types with TemplateLiteral. This type can be created using a string syntax that is similar to the TypeScript template literal syntax. This type can also be constructed by passing an array of Union and Literal types in sequence. The following example shows the string syntax.

```typescript
// TypeScript

type T = `option${'A'|'B'|'C'}`                      // type T = 'optionA' | 'optionB' | 'optionC'

type R = Record<T, string>                           // type R = {
                                                     //   optionA: string
                                                     //   optionB: string
                                                     //   optionC: string
                                                     // }

// TypeBox

const T = Type.TemplateLiteral('option${A|B|C}')     // const T = {
                                                     //   pattern: '^option(A|B|C)$',
                                                     //   type: 'string'
                                                     // }

const R = Type.Record(T, Type.String())              // const R = {
                                                     //   type: 'object',
                                                     //   required: ['optionA', 'optionB'],
                                                     //   properties: {
                                                     //     optionA: {
                                                     //       type: 'string'
                                                     //     },
                                                     //     optionB: {
                                                     //       type: 'string'
                                                     //     }
                                                     //     optionC: {
                                                     //       type: 'string'
                                                     //     }
                                                     //   }
                                                     // }
```

<a name='types-indexed'></a>

### Indexed Access Types

TypeBox supports Indexed Access Types with Index. This type enables uniform access to interior property and array element types without having to extract them from the underlying schema representation. This type is supported for Object, Array, Tuple, Union and Intersect types.

```typescript
const T = Type.Object({                              // const T = {
  x: Type.Number(),                                  //   type: 'object',
  y: Type.String(),                                  //   required: ['x', 'y', 'z'],
  z: Type.Boolean()                                  //   properties: {
})                                                   //     x: { type: 'number' },
                                                     //     y: { type: 'string' },
                                                     //     z: { type: 'string' }
                                                     //   }
                                                     // }

const A = Type.Index(T, ['x'])                       // const A = { type: 'number' }

const B = Type.Index(T, ['x', 'y'])                  // const B = {
                                                     //   anyOf: [
                                                     //     { type: 'number' },
                                                     //     { type: 'string' }
                                                     //   ]
                                                     // }

const C = Type.Index(T, Type.KeyOf(T))               // const C = {
                                                     //   anyOf: [
                                                     //     { type: 'number' },
                                                     //     { type: 'string' },
                                                     //     { type: 'boolean' }
                                                     //   ]
                                                     // }
```

<a name='types-rest'></a>

### Rest Types

TypeBox provides the Rest type to uniformly extract variadic tuples from Intersect, Union and Tuple types. This type can be useful to remap variadic types into different forms. The following uses Rest to remap a Tuple into a Union.

```typescript
const T = Type.Tuple([                               // const T = {
  Type.String(),                                     //   type: 'array',
  Type.Number()                                      //   items: [ 
])                                                   //     { type: 'string' },
                                                     //     { type: 'number' }
                                                     //   ],
                                                     //   additionalItems: false,
                                                     //   minItems: 2,
                                                     //   maxItems: 2,
                                                     // }

const R = Type.Rest(T)                               // const R = [
                                                     //   { type: 'string' },
                                                     //   { type: 'number' }
                                                     // ]

const U = Type.Union(R)                              // const U = {
                                                     //   anyOf: [
                                                     //     { type: 'string' },
                                                     //     { type: 'number' }
                                                     //   ]
                                                     // }
```

<a name='types-transform'></a>

### Transform Types

TypeBox supports value decoding and encoding with Transform types. These types work in tandem with the Encode and Decode functions available on the Value and TypeCompiler modules. Transform types can be used to convert Json encoded values into constructs more natural to JavaScript. The following creates a Transform type to decode numbers into Dates using the Value module.

```typescript
import { Value } from '@sinclair/typebox/value'

const T = Type.Transform(Type.Number())
  .Decode(value => new Date(value))                  // required: number to Date
  .Encode(value => value.getTime())                  // required: Date to number

const decoded = Value.Decode(T, 0)                   // const decoded = Date(1970-01-01T00:00:00.000Z)
const encoded = Value.Encode(T, decoded)             // const encoded = 0
```
Use the StaticEncode or StaticDecode types to infer a Transform type.
```typescript
import { Static, StaticDecode, StaticEncode } from '@sinclair/typebox'

const T = Type.Transform(Type.Array(Type.Number(), { uniqueItems: true }))         
  .Decode(value => new Set(value))
  .Encode(value => [...value])

type D = StaticDecode<typeof T>                      // type D = Set<number>      
type E = StaticEncode<typeof T>                      // type E = Array<number>
type T = Static<typeof T>                            // type T = Array<number>
```

<a name='types-intrinsic'></a>

### Intrinsic Types

TypeBox supports the TypeScript Intrinsic String Manipulation types Uppercase, Lowercase, Capitalize and Uncapitalize. These types can be used to remap String Literal, TemplateLiteral and Union types.

```typescript
// TypeScript

type A = Capitalize<'hello'>                         // type A = 'Hello'
type B = Capitalize<'hello' | 'world'>               // type C = 'Hello' | 'World'
type C = Capitalize<`hello${1|2|3}`>                 // type B = 'Hello1' | 'Hello2' | 'Hello3'

// TypeBox

const A = Type.Capitalize(Type.Literal('hello'))     // const A: TLiteral<'Hello'>

const B = Type.Capitalize(Type.Union([               // const B: TUnion<[
  Type.Literal('hello'),                             //   TLiteral<'Hello'>,
  Type.Literal('world')                              //   TLiteral<'World'>
]))                                                  // ]>

const C = Type.Capitalize(                           // const C: TTemplateLiteral<[
  Type.TemplateLiteral('hello${1|2|3}')              //   TLiteral<'Hello'>,
)                                                    //   TUnion<[
                                                     //     TLiteral<'1'>,
                                                     //     TLiteral<'2'>,
                                                     //     TLiteral<'3'>
                                                     //   ]>
                                                     // ]>
```

<a name='types-unsafe'></a>

### Unsafe Types

TypeBox supports user defined types with Unsafe. This type allows you to specify both schema representation and inference type. The following creates an Unsafe type with a number schema that infers as string.

```typescript
const T = Type.Unsafe<string>({ type: 'number' })    // const T = {
                                                     //   type: 'number'
                                                     // }

type T = Static<typeof T>                            // type T = string - ?
```
The Unsafe type is often used to create schematics for extended specifications like OpenAPI
```typescript

const Nullable = <T extends TSchema>(schema: T) => Type.Unsafe<Static<T> | null>({ 
  ...schema, nullable: true 
})

const T = Nullable(Type.String())                    // const T = {
                                                     //   type: 'string',
                                                     //   nullable: true
                                                     // }

type T = Static<typeof T>                            // type T = string | null

const StringEnum = <T extends string[]>(values: [...T]) => Type.Unsafe<T[number]>({ 
  type: 'string', enum: values 
})
const S = StringEnum(['A', 'B', 'C'])                // const S = {
                                                     //   enum: ['A', 'B', 'C']
                                                     // }

type S = Static<typeof T>                            // type S = 'A' | 'B' | 'C'
```
<a name='types-guard'></a>

### Type Guard

TypeBox can type check its own types with the TypeGuard module. This module is written for reflection and provides structural tests for every TypeBox type. Functions of this module return `is` guards which can be used with TypeScript control flow assertions to obtain schema inference. The following guards that the value A is TString.

```typescript
import { Type, Kind, TypeGuard } from '@sinclair/typebox'

const A: unknown = { ... }

if(TypeGuard.TString(A)) {

  A.type                                             // A.type = 'string'
}
```

<a name='types-strict'></a>

### Strict

TypeBox types contain various symbol properties that are used for reflection, composition and compilation. These properties are not strictly valid Json Schema; so in some cases it may be desirable to omit them. TypeBox provides a `Strict` function that will omit these properties if necessary.

```typescript
const T = Type.Object({                              // const T = {
  name: Type.Optional(Type.String())                 //   [Kind]: 'Object',
})                                                   //   type: 'object',
                                                     //   properties: {
                                                     //     name: {
                                                     //       type: 'string',
                                                     //       [Kind]: 'String',
                                                     //       [Optional]: 'Optional'
                                                     //     }
                                                     //   }
                                                     // }

const U = Type.Strict(T)                             // const U = {
                                                     //   type: 'object',
                                                     //   properties: {
                                                     //     name: {
                                                     //       type: 'string'
                                                     //     }
                                                     //   }
                                                     // }
```

<a name='values'></a>

## Values

TypeBox provides an optional utility module that can be used to perform structural operations on JavaScript values. This module includes functionality to create, check and cast values from types as well as check equality, clone, diff and patch JavaScript values. This module is provided via optional import.

```typescript
import { Value } from '@sinclair/typebox/value'
```

<a name='values-create'></a>

### Create

Use the Create function to create a value from a type. TypeBox will use default values if specified.

```typescript
const T = Type.Object({ x: Type.Number(), y: Type.Number({ default: 42 }) })

const A = Value.Create(T)                            // const A = { x: 0, y: 42 }
```

<a name='values-clone'></a>

### Clone

Use the Clone function to deeply clone a value.

```typescript
const A = Value.Clone({ x: 1, y: 2, z: 3 })          // const A = { x: 1, y: 2, z: 3 }
```

<a name='values-check'></a>

### Check

Use the Check function to type check a value.

```typescript
const T = Type.Object({ x: Type.Number() })

const R = Value.Check(T, { x: 1 })                   // const R = true
```

<a name='values-convert'></a>

### Convert

Use the Convert function to convert a value into its target type if a reasonable conversion is possible. This function may return an invalid value and should be checked before use. Its return type is `unknown`.

```typescript
const T = Type.Object({ x: Type.Number() })

const R1 = Value.Convert(T, { x: '3.14' })           // const R1 = { x: 3.14 }

const R2 = Value.Convert(T, { x: 'not a number' })   // const R2 = { x: 'not a number' }
```

<a name='values-cast'></a>

### Cast

Use the Cast function to cast a value with a type. The cast function will retain as much information as possible from the original value.

```typescript
const T = Type.Object({ x: Type.Number(), y: Type.Number() }, { additionalProperties: false })

const X = Value.Cast(T, null)                        // const X = { x: 0, y: 0 }

const Y = Value.Cast(T, { x: 1 })                    // const Y = { x: 1, y: 0 }

const Z = Value.Cast(T, { x: 1, y: 2, z: 3 })        // const Z = { x: 1, y: 2 }
```

<a name='values-decode'></a>

### Decode

Use the Decode function to decode a value from a type, or throw if the value is invalid. The return value will infer as the decoded type. This function will run Transform codecs if available.

```typescript
const A = Value.Decode(Type.String(), 'hello')        // const A = 'hello'

const B = Value.Decode(Type.String(), 42)             // throw
```
<a name='values-decode'></a>

### Encode

Use the Encode function to encode a value to a type, or throw if the value is invalid. The return value will infer as the encoded type. This function will run Transform codecs if available.

```typescript
const A = Value.Encode(Type.String(), 'hello')        // const A = 'hello'

const B = Value.Encode(Type.String(), 42)             // throw
```

<a name='values-equal'></a>

### Equal

Use the Equal function to deeply check for value equality.

```typescript
const R = Value.Equal(                               // const R = true
  { x: 1, y: 2, z: 3 },
  { x: 1, y: 2, z: 3 }
)
```

<a name='values-hash'></a>

### Hash

Use the Hash function to create a [FNV1A-64](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) non cryptographic hash of a value.

```typescript
const A = Value.Hash({ x: 1, y: 2, z: 3 })           // const A = 2910466848807138541n

const B = Value.Hash({ x: 1, y: 4, z: 3 })           // const B = 1418369778807423581n
```

<a name='values-diff'></a>

### Diff

Use the Diff function to generate a sequence of edits that will transform one value into another.

```typescript
const E = Value.Diff(                                // const E = [
  { x: 1, y: 2, z: 3 },                              //   { type: 'update', path: '/y', value: 4 },
  { y: 4, z: 5, w: 6 }                               //   { type: 'update', path: '/z', value: 5 },
)                                                    //   { type: 'insert', path: '/w', value: 6 },
                                                     //   { type: 'delete', path: '/x' }
                                                     // ]
```

<a name='values-patch'></a>

### Patch

Use the Patch function to apply a sequence of edits.

```typescript
const A = { x: 1, y: 2 }

const B = { x: 3 }

const E = Value.Diff(A, B)                           // const E = [
                                                     //   { type: 'update', path: '/x', value: 3 },
                                                     //   { type: 'delete', path: '/y' }
                                                     // ]

const C = Value.Patch<typeof B>(A, E)                // const C = { x: 3 }
```

<a name='values-errors'></a>

### Errors

Use the Errors function to enumerate validation errors.

```typescript
const T = Type.Object({ x: Type.Number(), y: Type.Number() })

const R = [...Value.Errors(T, { x: '42' })]          // const R = [{
                                                     //   schema: { type: 'number' },
                                                     //   path: '/x',
                                                     //   value: '42',
                                                     //   message: 'Expected number'
                                                     // }, {
                                                     //   schema: { type: 'number' },
                                                     //   path: '/y',
                                                     //   value: undefined,
                                                     //   message: 'Expected number'
                                                     // }]
```

<a name='values-mutate'></a>

### Mutate

Use the Mutate function to perform a deep mutable value assignment while retaining internal references.

```typescript
const Y = { z: 1 }                                   // const Y = { z: 1 }
const X = { y: Y }                                   // const X = { y: { z: 1 } }
const A = { x: X }                                   // const A = { x: { y: { z: 1 } } }

Value.Mutate(A, { x: { y: { z: 2 } } })              // const A' = { x: { y: { z: 2 } } }

const R0 = A.x.y.z === 2                             // const R0 = true
const R1 = A.x.y === Y                               // const R1 = true
const R2 = A.x === X                                 // const R2 = true
```

<a name='values-pointer'></a>

### Pointer

Use ValuePointer to perform mutable updates on existing values using [RFC6901](https://www.rfc-editor.org/rfc/rfc6901) Json Pointers.

```typescript
import { ValuePointer } from '@sinclair/typebox/value'

const A = { x: 0, y: 0, z: 0 }

ValuePointer.Set(A, '/x', 1)                         // const A' = { x: 1, y: 0, z: 0 }
ValuePointer.Set(A, '/y', 1)                         // const A' = { x: 1, y: 1, z: 0 }
ValuePointer.Set(A, '/z', 1)                         // const A' = { x: 1, y: 1, z: 1 }
```

<a name='typeregistry'></a>

## TypeRegistry

The TypeBox type system can be extended with additional types and formats using the TypeRegistry and FormatRegistry modules. These modules integrate deeply with TypeBox's internal type checking infrastructure and can be used to create application specific types, or register schematics for alternative specifications.

<a name='typeregistry-type'></a>

### TypeRegistry

Use the TypeRegistry to register a new type. The Kind must match the registered type name.

```typescript
import { TypeRegistry, Kind } from '@sinclair/typebox'

TypeRegistry.Set('Foo', (schema, value) => value === 'foo')

const A = Value.Check({ [Kind]: 'Foo' }, 'foo')      // const A = true
const B = Value.Check({ [Kind]: 'Foo' }, 'bar')      // const B = false
```

<a name='typeregistry-format'></a>

### FormatRegistry

Use the FormatRegistry to register a string format.

```typescript
import { FormatRegistry } from '@sinclair/typebox'

FormatRegistry.Set('foo', (value) => value === 'foo')

const T = Type.String({ format: 'foo' })

const A = Value.Check(T, 'foo')                      // const A = true
const B = Value.Check(T, 'bar')                      // const B = false
```

<a name='typecheck'></a>

## TypeCheck

TypeBox types target Json Schema Draft 7 and are compatible with any validator that supports this specification. TypeBox also provides a built in type checking compiler designed specifically for TypeBox types that offers high performance compilation and value checking.

The following sections detail using Ajv and the TypeBox compiler infrastructure.

<a name='typecheck-ajv'></a>

## Ajv

The following shows the recommended setup for Ajv.

```bash
$ npm install ajv ajv-formats --save
```

```typescript
import { Type }   from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv        from 'ajv'

const ajv = addFormats(new Ajv({}), [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex'
])

const validate = ajv.compile(Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}))

const R = validate({ x: 1, y: 2, z: 3 })             // const R = true
```

<a name='typecheck-typecompiler'></a>

### TypeCompiler

The TypeBox TypeCompiler is a high performance JIT validation compiler that transforms TypeBox types into optimized JavaScript validation routines. The compiler is tuned for fast compilation as well as fast value assertion. It is built to serve as a validation backend that can be integrated into larger applications. It can also be used for code generation.

The TypeCompiler is provided as an optional import.

```typescript
import { TypeCompiler } from '@sinclair/typebox/compiler'
```

Use the Compile function to JIT compile a type. Note that compilation is generally an expensive operation and should only be performed once per type during application start up. TypeBox does not cache previously compiled types, and applications are expected to hold references to each compiled type for the lifetime of the application.

```typescript
const C = TypeCompiler.Compile(Type.Object({         // const C: TypeCheck<TObject<{
  x: Type.Number(),                                  //     x: TNumber;
  y: Type.Number(),                                  //     y: TNumber;
  z: Type.Number()                                   //     z: TNumber;
}))                                                  // }>>

const R = C.Check({ x: 1, y: 2, z: 3 })              // const R = true
```

Use the Errors function to generate diagnostic errors for a value. The Errors function will return an iterator that when enumerated; will perform an exhaustive check across the entire value yielding any error found. For performance, this function should only be called after a failed Check. Applications may also choose to yield only the first value to avoid exhaustive error generation.

```typescript
const C = TypeCompiler.Compile(Type.Object({         // const C: TypeCheck<TObject<{
  x: Type.Number(),                                  //     x: TNumber;
  y: Type.Number(),                                  //     y: TNumber;
  z: Type.Number()                                   //     z: TNumber;
}))                                                  // }>>

const value = { }

const first = C.Errors(value).First()                // const first = {
                                                     //   schema: { type: 'number' },
                                                     //   path: '/x',
                                                     //   value: undefined,
                                                     //   message: 'Expected number'
                                                     // }

const all = [...C.Errors(value)]                     // const all = [{
                                                     //   schema: { type: 'number' },
                                                     //   path: '/x',
                                                     //   value: undefined,
                                                     //   message: 'Expected number'
                                                     // }, {
                                                     //   schema: { type: 'number' },
                                                     //   path: '/y',
                                                     //   value: undefined,
                                                     //   message: 'Expected number'
                                                     // }, {
                                                     //   schema: { type: 'number' },
                                                     //   path: '/z',
                                                     //   value: undefined,
                                                     //   message: 'Expected number'
                                                     // }]
```

Use the Code function to generate assertion functions as strings. This function can be used to create high performance assertions that can be written to disk as importable modules. The following generates code to check a string.

```typescript
const C = TypeCompiler.Code(Type.String())           // const C = `return function check(value) {
                                                     //   return (
                                                     //     (typeof value === 'string')
                                                     //   )
                                                     // }`
```

<a name='typesystem'></a>

## TypeSystem

The TypeBox TypeSystem module provides functionality to define types above and beyond the built-in Json and JavaScript type sets. They also manage TypeBox's localization options (i18n) for error message generation and can control various assertion policies used when type checking. Configurations made to the TypeSystem module are observed by the TypeCompiler, Value and Error modules.

<a name='typesystem-types'></a>

### Types

Use the TypeSystem Type function to register a user defined type.

```typescript
import { TypeSystem } from '@sinclair/typebox/system'

const StringSet = TypeSystem.Type<Set<string>>('StringSet', (options, value) => {
  return value instanceof Set && [...value].every(value => typeof value === 'string')
})

const T = StringSet({})                              // Pass options if any

const A = Value.Check(T, new Set())                  // const A = true
const B = Value.Check(T, new Set(['hello']))         // const B = true
const C = Value.Check(T, new Set([1]))               // const C = false

```

<a name='typesystem-formats'></a>

### Formats

Use the TypeSystem Format function to register a string format.

```typescript
import { TypeSystem } from '@sinclair/typebox/system'

const F = TypeSystem.Format('foo', value => value === 'Foo')   

const T = Type.String({ format: F })

const A = Value.Check(T, 'foo')                      // const A = true
const B = Value.Check(T, 'bar')                      // const B = false
```

<a name='typesystem-errors'></a>

### Errors

Use the TypeSystemErrorFunction to override validation error messages. This can be used to localize errors or create error messages for user defined types.

```typescript
import { TypeSystemErrorFunction, ValueErrorType, DefaultErrorFunction } from '@sinclair/typebox/system'

TypeSystemErrorFunction.Set((schema, errorType) => { // i18n override
  switch(errorType) {
    /* en-US */ case ValueErrorType.String: return 'Expected string'
    /* fr-FR */ case ValueErrorType.Number: return 'Nombre attendu'  
    /* ko-KR */ case ValueErrorType.Boolean: return '예상 부울'      
    /* en-US */ default: return DefaultErrorFunction(schema, errorType)          
  }
})
const T = Type.Object({                              // const T = { ... }
  x: Type.String(),
  y: Type.Number(),
  z: Type.Boolean()
})
const E = [...Value.Errors(T, {                      // const E = [{
  x: null,                                           //   type: 48,
  y: null,                                           //   schema: { ... },
  z: null                                            //   path: '/x',
})]                                                  //   value: null,
                                                     //   message: 'Expected string'
                                                     // }, {
                                                     //   type: 34,
                                                     //   schema: { ... },
                                                     //   path: '/y',
                                                     //   value: null,
                                                     //   message: 'Nombre attendu'
                                                     // }, {
                                                     //   type: 14,
                                                     //   schema: { ... },
                                                     //   path: '/z',
                                                     //   value: null,
                                                     //   message: '예상 부울'
                                                     // }]
```

<a name='typesystem-policies'></a>

### Policies

TypeBox validates using standard Json Schema assertion policies by default. The TypeSystemPolicy module can override some of these to have TypeBox check values inline with TypeScript static assertions. It also provides overrides for certain checking rules related to non-serializable values (such as void) which can be useful in Json based protocols such as JsonRpc-2. 

The following overrides are available.

```typescript
import { TypeSystemPolicy } from '@sinclair/typebox/system'

// Disallow undefined values for optional properties (default is false)
//
// const A: { x?: number } = { x: undefined } - disallowed when enabled

TypeSystemPolicy.ExactOptionalPropertyTypes = true

// Allow arrays to validate as object types (default is false)
//
// const A: {} = [] - allowed in TS

TypeSystemPolicy.AllowArrayObject = true

// Allow numeric values to be NaN or + or - Infinity (default is false)
//
// const A: number = NaN - allowed in TS

TypeSystemPolicy.AllowNaN = true

// Allow void types to check with undefined and null (default is false)
//
// Used to signal void return on Json-RPC 2.0 protocol

TypeSystemPolicy.AllowNullVoid = true
```

<a name='workbench'></a>

## TypeBox Workbench

TypeBox offers a web based code generation tool that can convert TypeScript types into TypeBox types as well as several other ecosystem libraries.

[TypeBox Workbench Link Here](https://sinclairzx81.github.io/typebox-workbench/)

<a name='codegen'></a>

## TypeBox Codegen

TypeBox provides a code generation library that can be used to automate type translation between TypeScript and TypeBox. This library also includes functionality to transform TypeScript types to other ecosystem libraries.

[TypeBox Codegen Link Here](https://github.com/sinclairzx81/typebox-codegen)

<a name='ecosystem'></a>

## Ecosystem

The following is a list of community packages that offer general tooling, extended functionality and framework integration support for TypeBox.

| Package   |  Description |
| ------------- | ------------- |
| [drizzle-typebox](https://www.npmjs.com/package/drizzle-typebox) | Generates TypeBox types from Drizzle ORM schemas |
| [elysia](https://github.com/elysiajs/elysia) | Fast and friendly Bun web framework |
| [fastify-type-provider-typebox](https://github.com/fastify/fastify-type-provider-typebox) | Fastify TypeBox integration with the Fastify Type Provider |
| [feathersjs](https://github.com/feathersjs/feathers) | The API and real-time application framework |
| [fetch-typebox](https://github.com/erfanium/fetch-typebox) | Drop-in replacement for fetch that brings easy integration with TypeBox |
| [h3-typebox](https://github.com/kevinmarrec/h3-typebox) | Schema validation utilities for h3 using TypeBox & Ajv |
| [http-wizard](https://github.com/flodlc/http-wizard) | Type safe http client library for Fastify |
| [openapi-box](https://github.com/geut/openapi-box) | Generate TypeBox types from OpenApi IDL + Http client library |
| [schema2typebox](https://github.com/xddq/schema2typebox)  | Creating TypeBox code from Json Schemas |
| [ts2typebox](https://github.com/xddq/ts2typebox) | Creating TypeBox code from Typescript types |
| [typebox-form-parser](https://github.com/jtlapp/typebox-form-parser) | Parses form and query data based on TypeBox schemas |
| [typebox-validators](https://github.com/jtlapp/typebox-validators) | Advanced validators supporting discriminated and heterogeneous unions |

<a name='benchmark'></a>

## Benchmark

This project maintains a set of benchmarks that measure Ajv, Value and TypeCompiler compilation and validation performance. These benchmarks can be run locally by cloning this repository and running `npm run benchmark`. The results below show for Ajv version 8.12.0 running on Node 20.0.0.

For additional comparative benchmarks, please refer to [typescript-runtime-type-benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/).

<a name='benchmark-compile'></a>

### Compile

This benchmark measures compilation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/compile.ts).

```typescript
┌────────────────────────────┬────────────┬──────────────┬──────────────┬──────────────┐
│          (index)           │ Iterations │     Ajv      │ TypeCompiler │ Performance  │
├────────────────────────────┼────────────┼──────────────┼──────────────┼──────────────┤
│ Literal_String             │    1000    │ '    216 ms' │ '      9 ms' │ '   24.00 x' │
│ Literal_Number             │    1000    │ '    169 ms' │ '      7 ms' │ '   24.14 x' │
│ Literal_Boolean            │    1000    │ '    150 ms' │ '      5 ms' │ '   30.00 x' │
│ Primitive_Number           │    1000    │ '    161 ms' │ '      7 ms' │ '   23.00 x' │
│ Primitive_String           │    1000    │ '    148 ms' │ '      6 ms' │ '   24.67 x' │
│ Primitive_String_Pattern   │    1000    │ '    185 ms' │ '      9 ms' │ '   20.56 x' │
│ Primitive_Boolean          │    1000    │ '    132 ms' │ '      4 ms' │ '   33.00 x' │
│ Primitive_Null             │    1000    │ '    141 ms' │ '      3 ms' │ '   47.00 x' │
│ Object_Unconstrained       │    1000    │ '   1109 ms' │ '     30 ms' │ '   36.97 x' │
│ Object_Constrained         │    1000    │ '   1200 ms' │ '     24 ms' │ '   50.00 x' │
│ Object_Vector3             │    1000    │ '    379 ms' │ '      9 ms' │ '   42.11 x' │
│ Object_Box3D               │    1000    │ '   1709 ms' │ '     30 ms' │ '   56.97 x' │
│ Tuple_Primitive            │    1000    │ '    456 ms' │ '     14 ms' │ '   32.57 x' │
│ Tuple_Object               │    1000    │ '   1229 ms' │ '     17 ms' │ '   72.29 x' │
│ Composite_Intersect        │    1000    │ '    570 ms' │ '     17 ms' │ '   33.53 x' │
│ Composite_Union            │    1000    │ '    513 ms' │ '     19 ms' │ '   27.00 x' │
│ Math_Vector4               │    1000    │ '    782 ms' │ '     13 ms' │ '   60.15 x' │
│ Math_Matrix4               │    1000    │ '    393 ms' │ '     12 ms' │ '   32.75 x' │
│ Array_Primitive_Number     │    1000    │ '    361 ms' │ '     12 ms' │ '   30.08 x' │
│ Array_Primitive_String     │    1000    │ '    296 ms' │ '      5 ms' │ '   59.20 x' │
│ Array_Primitive_Boolean    │    1000    │ '    315 ms' │ '      4 ms' │ '   78.75 x' │
│ Array_Object_Unconstrained │    1000    │ '   1721 ms' │ '     22 ms' │ '   78.23 x' │
│ Array_Object_Constrained   │    1000    │ '   1450 ms' │ '     21 ms' │ '   69.05 x' │
│ Array_Tuple_Primitive      │    1000    │ '    813 ms' │ '     13 ms' │ '   62.54 x' │
│ Array_Tuple_Object         │    1000    │ '   1537 ms' │ '     17 ms' │ '   90.41 x' │
│ Array_Composite_Intersect  │    1000    │ '    753 ms' │ '     17 ms' │ '   44.29 x' │
│ Array_Composite_Union      │    1000    │ '    808 ms' │ '     16 ms' │ '   50.50 x' │
│ Array_Math_Vector4         │    1000    │ '   1118 ms' │ '     16 ms' │ '   69.88 x' │
│ Array_Math_Matrix4         │    1000    │ '    690 ms' │ '      9 ms' │ '   76.67 x' │
└────────────────────────────┴────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-validate'></a>

### Validate

This benchmark measures validation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/check.ts).

```typescript
┌────────────────────────────┬────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│          (index)           │ Iterations │  ValueCheck  │     Ajv      │ TypeCompiler │ Performance  │
├────────────────────────────┼────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Literal_String             │  1000000   │ '     24 ms' │ '      5 ms' │ '      4 ms' │ '    1.25 x' │
│ Literal_Number             │  1000000   │ '     15 ms' │ '     20 ms' │ '     10 ms' │ '    2.00 x' │
│ Literal_Boolean            │  1000000   │ '     14 ms' │ '     19 ms' │ '      9 ms' │ '    2.11 x' │
│ Primitive_Number           │  1000000   │ '     25 ms' │ '     18 ms' │ '     10 ms' │ '    1.80 x' │
│ Primitive_String           │  1000000   │ '     21 ms' │ '     24 ms' │ '      9 ms' │ '    2.67 x' │
│ Primitive_String_Pattern   │  1000000   │ '    156 ms' │ '     43 ms' │ '     38 ms' │ '    1.13 x' │
│ Primitive_Boolean          │  1000000   │ '     18 ms' │ '     17 ms' │ '      9 ms' │ '    1.89 x' │
│ Primitive_Null             │  1000000   │ '     20 ms' │ '     17 ms' │ '      9 ms' │ '    1.89 x' │
│ Object_Unconstrained       │  1000000   │ '   1055 ms' │ '     32 ms' │ '     24 ms' │ '    1.33 x' │
│ Object_Constrained         │  1000000   │ '   1232 ms' │ '     49 ms' │ '     43 ms' │ '    1.14 x' │
│ Object_Vector3             │  1000000   │ '    432 ms' │ '     23 ms' │ '     13 ms' │ '    1.77 x' │
│ Object_Box3D               │  1000000   │ '   1993 ms' │ '     54 ms' │ '     46 ms' │ '    1.17 x' │
│ Object_Recursive           │  1000000   │ '   5115 ms' │ '    342 ms' │ '    159 ms' │ '    2.15 x' │
│ Tuple_Primitive            │  1000000   │ '    156 ms' │ '     21 ms' │ '     13 ms' │ '    1.62 x' │
│ Tuple_Object               │  1000000   │ '    740 ms' │ '     29 ms' │ '     18 ms' │ '    1.61 x' │
│ Composite_Intersect        │  1000000   │ '    797 ms' │ '     26 ms' │ '     14 ms' │ '    1.86 x' │
│ Composite_Union            │  1000000   │ '    530 ms' │ '     23 ms' │ '     13 ms' │ '    1.77 x' │
│ Math_Vector4               │  1000000   │ '    240 ms' │ '     22 ms' │ '     11 ms' │ '    2.00 x' │
│ Math_Matrix4               │  1000000   │ '   1036 ms' │ '     39 ms' │ '     27 ms' │ '    1.44 x' │
│ Array_Primitive_Number     │  1000000   │ '    248 ms' │ '     20 ms' │ '     12 ms' │ '    1.67 x' │
│ Array_Primitive_String     │  1000000   │ '    227 ms' │ '     22 ms' │ '     13 ms' │ '    1.69 x' │
│ Array_Primitive_Boolean    │  1000000   │ '    138 ms' │ '     21 ms' │ '     13 ms' │ '    1.62 x' │
│ Array_Object_Unconstrained │  1000000   │ '   5540 ms' │ '     66 ms' │ '     59 ms' │ '    1.12 x' │
│ Array_Object_Constrained   │  1000000   │ '   5750 ms' │ '    123 ms' │ '    108 ms' │ '    1.14 x' │
│ Array_Object_Recursive     │  1000000   │ '  21842 ms' │ '   1771 ms' │ '    599 ms' │ '    2.96 x' │
│ Array_Tuple_Primitive      │  1000000   │ '    715 ms' │ '     36 ms' │ '     29 ms' │ '    1.24 x' │
│ Array_Tuple_Object         │  1000000   │ '   3131 ms' │ '     63 ms' │ '     50 ms' │ '    1.26 x' │
│ Array_Composite_Intersect  │  1000000   │ '   3064 ms' │ '     44 ms' │ '     35 ms' │ '    1.26 x' │
│ Array_Composite_Union      │  1000000   │ '   2172 ms' │ '     65 ms' │ '     31 ms' │ '    2.10 x' │
│ Array_Math_Vector4         │  1000000   │ '   1032 ms' │ '     37 ms' │ '     24 ms' │ '    1.54 x' │
│ Array_Math_Matrix4         │  1000000   │ '   4859 ms' │ '    114 ms' │ '     86 ms' │ '    1.33 x' │
└────────────────────────────┴────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-compression'></a>

### Compression

The following table lists esbuild compiled and minified sizes for each TypeBox module.

```typescript
┌──────────────────────┬────────────┬────────────┬─────────────┐
│       (index)        │  Compiled  │  Minified  │ Compression │
├──────────────────────┼────────────┼────────────┼─────────────┤
│ typebox/compiler     │ '163.6 kb' │ ' 71.6 kb' │  '2.28 x'   │
│ typebox/errors       │ '113.3 kb' │ ' 50.1 kb' │  '2.26 x'   │
│ typebox/system       │ ' 83.9 kb' │ ' 37.5 kb' │  '2.24 x'   │
│ typebox/value        │ '191.1 kb' │ ' 82.3 kb' │  '2.32 x'   │
│ typebox              │ ' 73.8 kb' │ ' 32.3 kb' │  '2.29 x'   │
└──────────────────────┴────────────┴────────────┴─────────────┘
```

<a name='contribute'></a>

## Contribute

TypeBox is open to community contribution. Please ensure you submit an open issue before submitting your pull request. The TypeBox project preferences open community discussion prior to accepting new features.
