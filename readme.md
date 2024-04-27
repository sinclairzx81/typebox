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

```bash
$ npm install @sinclair/typebox --save
```

## Example

```typescript
import { Type, type Static } from '@sinclair/typebox'

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

TypeBox is a runtime type builder that creates in-memory Json Schema objects that infer as TypeScript types. The schematics produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type that can be statically checked by TypeScript and runtime asserted using standard Json Schema validation.

This library is designed to allow Json Schema to compose similar to how types compose within TypeScript's type system. It can be used as a simple tool to build up complex schematics or integrated into REST and RPC services to help validate data received over the wire.

License MIT

## Contents
- [Install](#install)
- [Overview](#overview)
- [Usage](#usage)
- [Types](#types)
  - [Json](#types-json)
  - [JavaScript](#types-javascript)
  - [Import](#types-import)
  - [Options](#types-options)
  - [Properties](#types-properties)
  - [Generics](#types-generics)
  - [References](#types-references)
  - [Recursive](#types-recursive)
  - [Template Literal](#types-template-literal)
  - [Indexed](#types-indexed)
  - [Mapped](#types-mapped)
  - [Conditional](#types-conditional)
  - [Intrinsic](#types-intrinsic)
  - [Transform](#types-transform)
  - [Rest](#types-rest)
  - [Guard](#types-guard)
  - [Unsafe](#types-unsafe)
  - [Strict](#types-strict)
- [Values](#values)
  - [Create](#values-create)
  - [Clone](#values-clone)
  - [Check](#values-check)
  - [Convert](#values-convert)
  - [Default](#values-default)
  - [Clean](#values-clean)
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
  - [Policies](#typesystem-policies)
- [Error Function](#error-function)
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
import { Type, type Static } from '@sinclair/typebox'

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
│ const T = Type.Const({         │ type T = {                  │ const T = {                    │
│   x: 1,                        │   readonly x: 1,            │   type: 'object',              │
│   y: 2,                        │   readonly y: 2             │   required: ['x', 'y'],        │
│ } as const)                    │ }                           │   properties: {                │
│                                │                             │     x: {                       │
│                                │                             │       type: 'number',          │
│                                │                             │       const: 1                 │
│                                │                             │     },                         │
│                                │                             │     y: {                       │
│                                │                             │       type: 'number',          │
│                                │                             │       const: 2                 │
│                                │                             │     }                          │
│                                │                             │   }                            │
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
│   Type.Number(),               │    ? true                   │   type: 'boolean'              │
│   Type.Literal(true),          │    : false                  │ }                              │
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
│ const T = Type.Mapped(         │ type T = {                  │ const T = {                    │
│   Type.Union([                 │   [_ in 'x' | 'y'] : number │   type: 'object',              │
│     Type.Literal('x'),         │ }                           │   required: ['x', 'y'],        │
│     Type.Literal('y')          │                             │   properties: {                │
│   ]),                          │                             │     x: {                       │
│   () => Type.Number()          │                             │       type: 'number'           │
│ )                              │                             │     },                         │
│                                │                             │     y: {                       │
│                                │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
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
│ const T = Type.RegExp(/abc/i)  │ type T = string             │ const T = {                    │
│                                │                             │   type: 'RegExp'               │
│                                │                             │   source: 'abc'                │
│                                │                             │   flags: 'i'                   │
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

<a name='types-import'></a>

### Import

Import the Type namespace to bring in the full TypeBox type system. This is recommended for most users.

```typescript
import { Type, type Static } from '@sinclair/typebox'
```

You can also selectively import types. This enables modern bundlers to tree shake for unused types.

```typescript
import { Object, Number, String, Boolean, type Static } from '@sinclair/typebox'
```

<a name='types-options'></a>

### Options

You can pass Json Schema options on the last argument of any given type. Option hints specific to each type are provided for convenience.

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

Generic types can be created with functions. TypeBox types extend the TSchema interface so you should constrain parameters to this type. The following creates a generic Vector type.

```typescript
import { Type, type Static, type TSchema } from '@sinclair/typebox'

const Vector = <T extends TSchema>(T: T) => 
  Type.Object({                                      // type Vector<T> = {
    x: T,                                            //   x: T,
    y: T,                                            //   y: T,
    z: T                                             //   z: T
  })                                                 // }

const NumberVector = Vector(Type.Number())           // type NumberVector = Vector<number>
```

Generic types are often used to create aliases for complex types. The following creates a Nullable generic type.

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

Reference types can be created with Ref. These types infer the same as the target type but only store a named `$ref` to the target type.

```typescript
const Vector = Type.Object({                         // const Vector = {
  x: Type.Number(),                                  //   type: 'object',
  y: Type.Number(),                                  //   required: ['x', 'y', 'z'],
}, { $id: 'Vector' })                                //   properties: {
                                                     //     x: { type: 'number' },
                                                     //     y: { type: 'number' }
                                                     //   },
                                                     //   $id: 'Vector'
                                                     // }

const VectorRef = Type.Ref(Vector)                   // const VectorRef = {
                                                     //   $ref: 'Vector'
                                                     // }

type VectorRef = Static<typeof VectorRef>            // type VectorRef = {
                                                     //    x: number,
                                                     //    y: number
                                                     // }
```
Use Deref to dereference a type. This function will replace any interior reference with the target type.
```typescript
const Vertex = Type.Object({                         // const Vertex = {
  position: VectorRef,                               //   type: 'object',
  texcoord: VectorRef,                               //   required: ['position', 'texcoord'],
})                                                   //   properties: {
                                                     //     position: { $ref: 'Vector' },
                                                     //     texcoord: { $ref: 'Vector' }
                                                     //   }
                                                     // }

const VertexDeref = Type.Deref(Vertex, [Vector])     // const VertexDeref = {
                                                     //   type: 'object',
                                                     //   required: ['position', 'texcoord'],
                                                     //   properties: {
                                                     //     position: {
                                                     //       type: 'object',
                                                     //       required: ['x', 'y', 'z'],
                                                     //       properties: {
                                                     //         x: { type: 'number' },
                                                     //         y: { type: 'number' }
                                                     //       }
                                                     //     },
                                                     //     texcoord: {
                                                     //       type: 'object',
                                                     //       required: ['x', 'y', 'z'],
                                                     //       properties: {
                                                     //         x: { type: 'number' },
                                                     //         y: { type: 'number' }
                                                     //       }
                                                     //     }
                                                     //   }
                                                     // }
```
Note that Ref types do not store structural information about the type they're referencing. Because of this, these types cannot be used with some mapping types (such as Partial or Pick). For applications that require mapping on Ref, use Deref to normalize the type first.

<a name='types-recursive'></a>

### Recursive Types

TypeBox supports recursive data structures with Recursive. This type wraps an interior type and provides it a `this` context that allows the type to reference itself. The following creates a recursive type. Singular recursive inference is also supported.

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

<a name='types-template-literal'></a>

### Template Literal Types

TypeBox supports template literal types with the TemplateLiteral function. This type can be created using a syntax similar to the TypeScript template literal syntax or composed from exterior types. TypeBox encodes template literals as regular expressions which enables the template to be checked by Json Schema validators. This type also supports regular expression parsing that enables template patterns to be used for generative types. The following shows both TypeScript and TypeBox usage.

```typescript
// TypeScript

type K = `prop${'A'|'B'|'C'}`                        // type T = 'propA' | 'propB' | 'propC'

type R = Record<K, string>                           // type R = {
                                                     //   propA: string
                                                     //   propB: string
                                                     //   propC: string
                                                     // }

// TypeBox

const K = Type.TemplateLiteral('prop${A|B|C}')       // const K: TTemplateLiteral<[
                                                     //   TLiteral<'prop'>,
                                                     //   TUnion<[
                                                     //      TLiteral<'A'>,
                                                     //      TLiteral<'B'>,
                                                     //      TLiteral<'C'>,
                                                     //   ]>
                                                     // ]>

const R = Type.Record(K, Type.String())              // const R: TObject<{
                                                     //   propA: TString,
                                                     //   propB: TString,
                                                     //   propC: TString,
                                                     // }>
```

<a name='types-indexed'></a>

### Indexed Access Types

TypeBox supports indexed access types with the Index function. This function enables uniform access to interior property and element types without having to extract them from the underlying schema representation. Index types are supported for Object, Array, Tuple, Union and Intersect types.

```typescript
const T = Type.Object({                              // type T = {
  x: Type.Number(),                                  //   x: number,
  y: Type.String(),                                  //   y: string,
  z: Type.Boolean()                                  //   z: boolean
})                                                   // }

const A = Type.Index(T, ['x'])                       // type A = T['x']
                                                     //
                                                     // ... evaluated as
                                                     //
                                                     // const A: TNumber

const B = Type.Index(T, ['x', 'y'])                  // type B = T['x' | 'y']
                                                     //
                                                     // ... evaluated as
                                                     //
                                                     // const B: TUnion<[
                                                     //   TNumber,
                                                     //   TString,
                                                     // ]>

const C = Type.Index(T, Type.KeyOf(T))               // type C = T[keyof T]
                                                     //
                                                     // ... evaluated as
                                                     // 
                                                     // const C: TUnion<[
                                                     //   TNumber,
                                                     //   TString,
                                                     //   TBoolean
                                                     // ]>
```

<a name='types-mapped'></a>

### Mapped Types

TypeBox supports mapped types with the Mapped function. This function accepts two arguments, the first is a union type typically derived from KeyOf, the second is a mapping function that receives a mapping key `K` that can be used to index properties of a type. The following implements a mapped type that remaps each property to be `T | null`

```typescript
const T = Type.Object({                              // type T = {
  x: Type.Number(),                                  //   x: number,
  y: Type.String(),                                  //   y: string,
  z: Type.Boolean()                                  //   z: boolean
})                                                   // }

const M = Type.Mapped(Type.KeyOf(T), K => {          // type M = { [K in keyof T]: T[K] | null }
  return Type.Union([Type.Index(T, K), Type.Null()]) //
})                                                   // ... evaluated as
                                                     // 
                                                     // const M: TObject<{
                                                     //   x: TUnion<[TNumber, TNull]>,
                                                     //   y: TUnion<[TString, TNull]>,
                                                     //   z: TUnion<[TBoolean, TNull]>
                                                     // }>
```

<a name='types-conditional'></a>

### Conditional Types

TypeBox supports runtime conditional types with the Extends function. This function performs a structural assignability check against the first (`left`) and second (`right`) arguments and will return either the third (`true`) or fourth (`false`) argument based on the result. The conditional types Exclude and Extract are also supported. The following shows both TypeScript and TypeBox examples of conditional types.

```typescript
// Extends
const A = Type.Extends(                              // type A = string extends number ? 1 : 2
  Type.String(),                                     //   
  Type.Number(),                                     // ... evaluated as
  Type.Literal(1),                                   //
  Type.Literal(2)                                    // const A: TLiteral<2>
)

// Extract
const B = Type.Extract(                              // type B = Extract<1 | 2 | 3, 1>
  Type.Union([                                       //
    Type.Literal(1),                                 // ... evaluated as
    Type.Literal(2),                                 //
    Type.Literal(3)                                  // const B: TLiteral<1>
  ]), 
  Type.Literal(1)
)

// Exclude
const C = Type.Exclude(                              // type C = Exclude<1 | 2 | 3, 1>
  Type.Union([                                       // 
    Type.Literal(1),                                 // ... evaluated as
    Type.Literal(2),                                 //
    Type.Literal(3)                                  // const C: TUnion<[
  ]),                                                //   TLiteral<2>,
  Type.Literal(1)                                    //   TLiteral<3>,
)                                                    // ]>
```

<a name='types-intrinsic'></a>

### Intrinsic Types

TypeBox supports the TypeScript intrinsic string manipulation types Uppercase, Lowercase, Capitalize and Uncapitalize. These types can be used to remap Literal, Template Literal and Union of Literal types.

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

<a name='types-transform'></a>

### Transform Types

TypeBox supports value decoding and encoding with Transform types. These types work in tandem with the Encode and Decode functions available on the Value and TypeCompiler submodules. Transform types can be used to convert Json encoded values into constructs more natural to JavaScript. The following creates a Transform type to decode numbers into Dates using the Value submodule.

```typescript
import { Value } from '@sinclair/typebox/value'

const T = Type.Transform(Type.Number())
  .Decode(value => new Date(value))                  // decode: number to Date
  .Encode(value => value.getTime())                  // encode: Date to number

const D = Value.Decode(T, 0)                         // const D = Date(1970-01-01T00:00:00.000Z)
const E = Value.Encode(T, D)                         // const E = 0
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

<a name='types-rest'></a>

### Rest Types

TypeBox provides the Rest type to uniformly extract variadic tuples from Intersect, Union and Tuple types. This type can be useful to remap variadic types into different forms. The following uses Rest to remap a Tuple into a Union.

```typescript
const T = Type.Tuple([                               // const T: TTuple<[
  Type.String(),                                     //   TString,
  Type.Number()                                      //   TNumber
])                                                   // ]>

const R = Type.Rest(T)                               // const R: [TString, TNumber]

const U = Type.Union(R)                              // const T: TUnion<[
                                                     //   TString,
                                                     //   TNumber
                                                     // ]>
```

<a name='types-unsafe'></a>

### Unsafe Types

TypeBox supports user defined types with Unsafe. This type allows you to specify both schema representation and inference type. The following creates an Unsafe type with a number schema that infers as string.

```typescript
const T = Type.Unsafe<string>({ type: 'number' })    // const T = { type: 'number' }

type T = Static<typeof T>                            // type T = string - ?
```
The Unsafe type is often used to create schematics for extended specifications like OpenAPI.
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

### TypeGuard

TypeBox can check its own types with the TypeGuard module. This module is written for type introspection and provides structural tests for every built-in TypeBox type. Functions of this module return `is` guards which can be used with control flow assertions to obtain schema inference for unknown values. The following guards that the value `T` is TString.

```typescript
import { TypeGuard, Kind } from '@sinclair/typebox'

const T = { [Kind]: 'String', type: 'string' }

if(TypeGuard.IsString(T)) {

  // T is TString
}
```

<a name='types-strict'></a>

### Strict

TypeBox types contain various symbol properties that are used for reflection, composition and compilation. These properties are not strictly valid Json Schema; so in some cases it may be desirable to omit them. TypeBox provides a `Strict` function that will omit these properties if necessary.

```typescript
const T = Type.Object({                              // const T = {
  name: Type.Optional(Type.String())                 //   [Symbol(TypeBox.Kind)]: 'Object',
})                                                   //   type: 'object',
                                                     //   properties: {
                                                     //     name: {
                                                     //       type: 'string',
                                                     //       [Symbol(TypeBox.Kind)]: 'String',
                                                     //       [Symbol(TypeBox.Optional)]: 'Optional'
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

TypeBox provides an optional Value submodule that can be used to perform structural operations on JavaScript values. This submodule includes functionality to create, check and cast values from types as well as check equality, clone, diff and patch JavaScript values. This submodule is provided via optional import.

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

<a name='values-clean'></a>

### Clean

Use Clean to remove excess properties from a value. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first.

```typescript
const T = Type.Object({ 
  x: Type.Number(), 
  y: Type.Number() 
})

const X = Value.Clean(T, null)                        // const 'X = null

const Y = Value.Clean(T, { x: 1 })                    // const 'Y = { x: 1 }

const Z = Value.Clean(T, { x: 1, y: 2, z: 3 })        // const 'Z = { x: 1, y: 2 }
```

<a name='values-default'></a>

### Default

Use Default to generate missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first.

```typescript
const T = Type.Object({ 
  x: Type.Number({ default: 0 }), 
  y: Type.Number({ default: 0 })
})

const X = Value.Default(T, null)                        // const 'X = null - non-enumerable

const Y = Value.Default(T, { })                         // const 'Y = { x: 0, y: 0 }

const Z = Value.Default(T, { x: 1 })                    // const 'Z = { x: 1, y: 0 }
```

<a name='values-cast'></a>

### Cast

Use the Cast function to upcast a value into a target type. This function will retain as much infomation as possible from the original value. The Cast function is intended to be used in data migration scenarios where existing values need to be upgraded to match a modified type.

```typescript
const T = Type.Object({ x: Type.Number(), y: Type.Number() }, { additionalProperties: false })

const X = Value.Cast(T, null)                        // const X = { x: 0, y: 0 }

const Y = Value.Cast(T, { x: 1 })                    // const Y = { x: 1, y: 0 }

const Z = Value.Cast(T, { x: 1, y: 2, z: 3 })        // const Z = { x: 1, y: 2 }
```

<a name='values-decode'></a>

### Decode

Use the Decode function to decode a value from a type or throw if the value is invalid. The return value will infer as the decoded type. This function will run Transform codecs if available.

```typescript
const A = Value.Decode(Type.String(), 'hello')        // const A = 'hello'

const B = Value.Decode(Type.String(), 42)             // throw
```
<a name='values-decode'></a>

### Encode

Use the Encode function to encode a value to a type or throw if the value is invalid. The return value will infer as the encoded type. This function will run Transform codecs if available.

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

Value.Mutate(A, { x: { y: { z: 2 } } })              // A' = { x: { y: { z: 2 } } }

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

ValuePointer.Set(A, '/x', 1)                         // A' = { x: 1, y: 0, z: 0 }
ValuePointer.Set(A, '/y', 1)                         // A' = { x: 1, y: 1, z: 0 }
ValuePointer.Set(A, '/z', 1)                         // A' = { x: 1, y: 1, z: 1 }
```

<a name='typeregistry'></a>

## TypeRegistry

The TypeBox type system can be extended with additional types and formats using the TypeRegistry and FormatRegistry modules. These modules integrate deeply with TypeBox's internal type checking infrastructure and can be used to create application specific types, or register schematics for alternative specifications.

<a name='typeregistry-type'></a>

### TypeRegistry

Use the TypeRegistry to register a type. The Kind must match the registered type name.

```typescript
import { TSchema, Kind, TypeRegistry } from '@sinclair/typebox'

TypeRegistry.Set('Foo', (schema, value) => value === 'foo')

const Foo = { [Kind]: 'Foo' } as TSchema 

const A = Value.Check(Foo, 'foo')                    // const A = true

const B = Value.Check(Foo, 'bar')                    // const B = false
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

Use the Code function to generate assertion functions as strings. This function can be used to generate code that can be written to disk as importable modules. This technique is sometimes referred to as Ahead of Time (AOT) compilation. The following generates code to check a string.

```typescript
const C = TypeCompiler.Code(Type.String())           // const C = `return function check(value) {
                                                     //   return (
                                                     //     (typeof value === 'string')
                                                     //   )
                                                     // }`
```

<a name='typesystem'></a>

## TypeSystem

The TypeBox TypeSystem module provides configurations to use either Json Schema or TypeScript type checking semantics. Configurations made to the TypeSystem module are observed by the TypeCompiler, Value and Error modules.

<a name='typesystem-policies'></a>

### Policies

TypeBox validates using standard Json Schema assertion policies by default. The TypeSystemPolicy module can override some of these to have TypeBox assert values inline with TypeScript static checks. It also provides overrides for certain checking rules related to non-serializable values (such as void) which can be helpful in Json based protocols such as Json Rpc 2.0. 

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
// Used to signal void return on Json-Rpc 2.0 protocol

TypeSystemPolicy.AllowNullVoid = true
```

<a name='error-function'></a>

## Error Function

Error messages in TypeBox can be customized by defining an ErrorFunction. This function allows for the localization of error messages as well as enabling custom error messages for custom types. By default, TypeBox will generate messages using the `en-US` locale. To support additional locales, you can replicate the function found in `src/errors/function.ts` and create a locale specific translation. The function can then be set via SetErrorFunction.

The following example shows an inline error function that intercepts errors for String, Number and Boolean only. The DefaultErrorFunction is used to return a default error message.


```typescript
import { SetErrorFunction, DefaultErrorFunction, ValueErrorType } from '@sinclair/typebox/errors'

SetErrorFunction((error) => { // i18n override
  switch(error.errorType) {
    /* en-US */ case ValueErrorType.String: return 'Expected string'
    /* fr-FR */ case ValueErrorType.Number: return 'Nombre attendu'  
    /* ko-KR */ case ValueErrorType.Boolean: return '예상 부울'      
    /* en-US */ default: return DefaultErrorFunction(error)          
  }
})
const T = Type.Object({                              // const T: TObject<{
  x: Type.String(),                                  //  TString,
  y: Type.Number(),                                  //  TNumber,
  z: Type.Boolean()                                  //  TBoolean
})                                                   // }>

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

<a name='workbench'></a>

## TypeBox Workbench

TypeBox offers a web based code generation tool that can convert TypeScript types into TypeBox types as well as several other ecosystem libraries.

[TypeBox Workbench Link Here](https://sinclairzx81.github.io/typebox-workbench/)

<a name='codegen'></a>

## TypeBox Codegen

TypeBox provides a code generation library that can be integrated into toolchains to automate type translation between TypeScript and TypeBox. This library also includes functionality to transform TypeScript types to other ecosystem libraries.

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
| [prismabox](https://github.com/m1212e/prismabox) | Converts a prisma.schema to typebox schema matching the database models |
| [schema2typebox](https://github.com/xddq/schema2typebox)  | Creating TypeBox code from Json Schemas |
| [sveltekit-superforms](https://github.com/ciscoheat/sveltekit-superforms)  | A comprehensive SvelteKit form library for server and client validation |
| [ts2typebox](https://github.com/xddq/ts2typebox) | Creating TypeBox code from Typescript types |
| [typebox-form-parser](https://github.com/jtlapp/typebox-form-parser) | Parses form and query data based on TypeBox schemas |
| [typebox-validators](https://github.com/jtlapp/typebox-validators) | Advanced validators supporting discriminated and heterogeneous unions |

<a name='benchmark'></a>

## Benchmark

This project maintains a set of benchmarks that measure Ajv, Value and TypeCompiler compilation and validation performance. These benchmarks can be run locally by cloning this repository and running `npm run benchmark`. The results below show for Ajv version 8.12.0 running on Node 20.10.0.

For additional comparative benchmarks, please refer to [typescript-runtime-type-benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/).

<a name='benchmark-compile'></a>

### Compile

This benchmark measures compilation performance for varying types.

```typescript
┌────────────────────────────┬────────────┬──────────────┬──────────────┬──────────────┐
│          (index)           │ Iterations │     Ajv      │ TypeCompiler │ Performance  │
├────────────────────────────┼────────────┼──────────────┼──────────────┼──────────────┤
│ Literal_String             │    1000    │ '    242 ms' │ '     10 ms' │ '   24.20 x' │
│ Literal_Number             │    1000    │ '    200 ms' │ '      8 ms' │ '   25.00 x' │
│ Literal_Boolean            │    1000    │ '    168 ms' │ '      6 ms' │ '   28.00 x' │
│ Primitive_Number           │    1000    │ '    165 ms' │ '      8 ms' │ '   20.63 x' │
│ Primitive_String           │    1000    │ '    154 ms' │ '      6 ms' │ '   25.67 x' │
│ Primitive_String_Pattern   │    1000    │ '    208 ms' │ '     14 ms' │ '   14.86 x' │
│ Primitive_Boolean          │    1000    │ '    142 ms' │ '      6 ms' │ '   23.67 x' │
│ Primitive_Null             │    1000    │ '    143 ms' │ '      6 ms' │ '   23.83 x' │
│ Object_Unconstrained       │    1000    │ '   1217 ms' │ '     31 ms' │ '   39.26 x' │
│ Object_Constrained         │    1000    │ '   1275 ms' │ '     26 ms' │ '   49.04 x' │
│ Object_Vector3             │    1000    │ '    405 ms' │ '     12 ms' │ '   33.75 x' │
│ Object_Box3D               │    1000    │ '   1833 ms' │ '     27 ms' │ '   67.89 x' │
│ Tuple_Primitive            │    1000    │ '    475 ms' │ '     13 ms' │ '   36.54 x' │
│ Tuple_Object               │    1000    │ '   1267 ms' │ '     30 ms' │ '   42.23 x' │
│ Composite_Intersect        │    1000    │ '    604 ms' │ '     18 ms' │ '   33.56 x' │
│ Composite_Union            │    1000    │ '    545 ms' │ '     20 ms' │ '   27.25 x' │
│ Math_Vector4               │    1000    │ '    829 ms' │ '     12 ms' │ '   69.08 x' │
│ Math_Matrix4               │    1000    │ '    405 ms' │ '     10 ms' │ '   40.50 x' │
│ Array_Primitive_Number     │    1000    │ '    372 ms' │ '     12 ms' │ '   31.00 x' │
│ Array_Primitive_String     │    1000    │ '    327 ms' │ '      5 ms' │ '   65.40 x' │
│ Array_Primitive_Boolean    │    1000    │ '    300 ms' │ '      4 ms' │ '   75.00 x' │
│ Array_Object_Unconstrained │    1000    │ '   1755 ms' │ '     21 ms' │ '   83.57 x' │
│ Array_Object_Constrained   │    1000    │ '   1516 ms' │ '     20 ms' │ '   75.80 x' │
│ Array_Tuple_Primitive      │    1000    │ '    825 ms' │ '     14 ms' │ '   58.93 x' │
│ Array_Tuple_Object         │    1000    │ '   1616 ms' │ '     16 ms' │ '  101.00 x' │
│ Array_Composite_Intersect  │    1000    │ '    776 ms' │ '     16 ms' │ '   48.50 x' │
│ Array_Composite_Union      │    1000    │ '    820 ms' │ '     14 ms' │ '   58.57 x' │
│ Array_Math_Vector4         │    1000    │ '   1166 ms' │ '     15 ms' │ '   77.73 x' │
│ Array_Math_Matrix4         │    1000    │ '    695 ms' │ '      8 ms' │ '   86.88 x' │
└────────────────────────────┴────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-validate'></a>

### Validate

This benchmark measures validation performance for varying types.

```typescript
┌────────────────────────────┬────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│          (index)           │ Iterations │  ValueCheck  │     Ajv      │ TypeCompiler │ Performance  │
├────────────────────────────┼────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Literal_String             │  1000000   │ '     18 ms' │ '      5 ms' │ '      4 ms' │ '    1.25 x' │
│ Literal_Number             │  1000000   │ '     16 ms' │ '     18 ms' │ '     10 ms' │ '    1.80 x' │
│ Literal_Boolean            │  1000000   │ '     15 ms' │ '     19 ms' │ '     10 ms' │ '    1.90 x' │
│ Primitive_Number           │  1000000   │ '     21 ms' │ '     19 ms' │ '     10 ms' │ '    1.90 x' │
│ Primitive_String           │  1000000   │ '     22 ms' │ '     18 ms' │ '      9 ms' │ '    2.00 x' │
│ Primitive_String_Pattern   │  1000000   │ '    155 ms' │ '     41 ms' │ '     34 ms' │ '    1.21 x' │
│ Primitive_Boolean          │  1000000   │ '     18 ms' │ '     17 ms' │ '      9 ms' │ '    1.89 x' │
│ Primitive_Null             │  1000000   │ '     19 ms' │ '     17 ms' │ '      9 ms' │ '    1.89 x' │
│ Object_Unconstrained       │  1000000   │ '   1003 ms' │ '     32 ms' │ '     24 ms' │ '    1.33 x' │
│ Object_Constrained         │  1000000   │ '   1265 ms' │ '     49 ms' │ '     38 ms' │ '    1.29 x' │
│ Object_Vector3             │  1000000   │ '    418 ms' │ '     22 ms' │ '     13 ms' │ '    1.69 x' │
│ Object_Box3D               │  1000000   │ '   2035 ms' │ '     56 ms' │ '     49 ms' │ '    1.14 x' │
│ Object_Recursive           │  1000000   │ '   5243 ms' │ '    326 ms' │ '    157 ms' │ '    2.08 x' │
│ Tuple_Primitive            │  1000000   │ '    153 ms' │ '     20 ms' │ '     12 ms' │ '    1.67 x' │
│ Tuple_Object               │  1000000   │ '    781 ms' │ '     28 ms' │ '     18 ms' │ '    1.56 x' │
│ Composite_Intersect        │  1000000   │ '    742 ms' │ '     25 ms' │ '     14 ms' │ '    1.79 x' │
│ Composite_Union            │  1000000   │ '    558 ms' │ '     24 ms' │ '     13 ms' │ '    1.85 x' │
│ Math_Vector4               │  1000000   │ '    246 ms' │ '     22 ms' │ '     11 ms' │ '    2.00 x' │
│ Math_Matrix4               │  1000000   │ '   1052 ms' │ '     43 ms' │ '     28 ms' │ '    1.54 x' │
│ Array_Primitive_Number     │  1000000   │ '    272 ms' │ '     22 ms' │ '     12 ms' │ '    1.83 x' │
│ Array_Primitive_String     │  1000000   │ '    235 ms' │ '     24 ms' │ '     14 ms' │ '    1.71 x' │
│ Array_Primitive_Boolean    │  1000000   │ '    134 ms' │ '     23 ms' │ '     14 ms' │ '    1.64 x' │
│ Array_Object_Unconstrained │  1000000   │ '   6280 ms' │ '     65 ms' │ '     59 ms' │ '    1.10 x' │
│ Array_Object_Constrained   │  1000000   │ '   6076 ms' │ '    130 ms' │ '    119 ms' │ '    1.09 x' │
│ Array_Object_Recursive     │  1000000   │ '  22738 ms' │ '   1730 ms' │ '    635 ms' │ '    2.72 x' │
│ Array_Tuple_Primitive      │  1000000   │ '    689 ms' │ '     35 ms' │ '     30 ms' │ '    1.17 x' │
│ Array_Tuple_Object         │  1000000   │ '   3266 ms' │ '     63 ms' │ '     52 ms' │ '    1.21 x' │
│ Array_Composite_Intersect  │  1000000   │ '   3310 ms' │ '     44 ms' │ '     36 ms' │ '    1.22 x' │
│ Array_Composite_Union      │  1000000   │ '   2432 ms' │ '     69 ms' │ '     33 ms' │ '    2.09 x' │
│ Array_Math_Vector4         │  1000000   │ '   1158 ms' │ '     37 ms' │ '     24 ms' │ '    1.54 x' │
│ Array_Math_Matrix4         │  1000000   │ '   5435 ms' │ '    132 ms' │ '     92 ms' │ '    1.43 x' │
└────────────────────────────┴────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-compression'></a>

### Compression

The following table lists esbuild compiled and minified sizes for each TypeBox module.

```typescript
┌──────────────────────┬────────────┬────────────┬─────────────┐
│       (index)        │  Compiled  │  Minified  │ Compression │
├──────────────────────┼────────────┼────────────┼─────────────┤
│ typebox/compiler     │ '126.9 kb' │ ' 55.7 kb' │  '2.28 x'   │
│ typebox/errors       │ ' 46.1 kb' │ ' 20.8 kb' │  '2.22 x'   │
│ typebox/system       │ '  4.7 kb' │ '  2.0 kb' │  '2.33 x'   │
│ typebox/value        │ '152.2 kb' │ ' 64.5 kb' │  '2.36 x'   │
│ typebox              │ ' 95.7 kb' │ ' 39.8 kb' │  '2.40 x'   │
└──────────────────────┴────────────┴────────────┴─────────────┘
```

<a name='contribute'></a>

## Contribute

TypeBox is open to community contribution. Please ensure you submit an open issue before submitting your pull request. The TypeBox project prefers open community discussion before accepting new features.
