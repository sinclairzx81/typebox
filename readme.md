<div align='center'>

<h1>TypeBox</h1>

<p>JSON Schema Type Builder with Static Type Resolution for TypeScript</p>
	
<img src="./typebox.png" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox.svg)](https://badge.fury.io/js/%40sinclair%2Ftypebox)
[![Downloads](https://img.shields.io/npm/dm/%40sinclair%2Ftypebox.svg)](https://www.npmjs.com/package/%40sinclair%2Ftypebox)
[![GitHub CI](https://github.com/sinclairzx81/typebox/workflows/GitHub%20CI/badge.svg)](https://github.com/sinclairzx81/typebox/actions)

</div>

<a name="Install"></a>

## Install

#### Npm
```bash
$ npm install @sinclair/typebox --save
```

#### Deno
```typescript
import { Static, Type } from 'npm:@sinclair/typebox'
```

#### Esm

```typescript
import { Static, Type } from 'https://esm.sh/@sinclair/typebox'
```

## Example

```typescript
import { Static, Type } from '@sinclair/typebox'

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

TypeBox is a runtime type builder that constructs in-memory JSON Schema objects that can be statically inferred as TypeScript types. The schemas produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox enables one to create a unified type that can be statically checked by TypeScript and runtime asserted using standard JSON Schema validation.

This library is designed to enable JSON schema to compose with the same flexibility as TypeScript's type system. It can be used as a simple tool to build up complex schemas or integrated into REST and RPC services to help validate data received over the wire. 

License MIT

## Contents
- [Install](#install)
- [Overview](#overview)
- [Usage](#usage)
- [Types](#types)
  - [Standard](#types-standard)
  - [Extended](#types-extended)
  - [Modifiers](#types-modifiers)
  - [Options](#types-options)
  - [Generics](#types-generics)
  - [References](#types-references)
  - [Recursive](#types-recursive)
  - [Conditional](#types-conditional)
  - [Guards](#types-guards)
  - [Unsafe](#types-unsafe)
  - [Strict](#types-strict)
- [Values](#values)
  - [Create](#values-create)
  - [Clone](#values-clone)
  - [Check](#values-check)
  - [Convert](#values-convert)
  - [Cast](#values-cast)
  - [Equal](#values-equal)
  - [Hash](#values-hash)
  - [Diff](#values-diff)
  - [Patch](#values-patch)
  - [Errors](#values-errors)
  - [Pointer](#values-pointer)
- [TypeCheck](#typecheck)
  - [Ajv](#typecheck-ajv)
  - [TypeCompiler](#typecheck-typecompiler)
- [TypeSystem](#typecheck)
  - [Types](#typesystem-types)
  - [Formats](#typesystem-formats)
  - [Policies](#typesystem-policies)
- [Benchmark](#benchmark)
  - [Compile](#benchmark-compile)
  - [Validate](#benchmark-validate)
  - [Compression](#benchmark-compression)
- [Contribute](#contribute)

<a name="usage"></a>

## Usage

The following shows general usage.

```typescript
import { Static, Type } from '@sinclair/typebox'

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
// ... then use the type both as JSON schema and as a TypeScript type.
//
//--------------------------------------------------------------------------------------------

import { Value } from '@sinclair/typebox/value'

function receive(value: T) {                         // ... as a Static Type

  if(Value.Check(T, value)) {                        // ... as a JSON Schema
  
    // ok...
  }
}
```

<a name='types'></a>

## Types

TypeBox types are small JSON schema fragments which can compose into more complex types though function composition. Each fragment is strictly defined to match to the static type checking rules of TypeScript. TypeBox provides a Standard type set which produces standards compliant JSON schema as well as an Extended type set used to define native JavaScript constructs.

<a name='types-standard'></a>

### Standard Types

The following table lists the Standard TypeBox types. These types are fully compatible with the JSON Schema specification.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ JSON Schema                    │
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
│                                │                             │    type: 'null'                │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Literal(42)     │ type T = 42                 │ const T = {                    │
│                                │                             │    const: 42,                  │
│                                │                             │    type: 'number'              │
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
│                                │                             │     }, {                       │
│                                │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Tuple([         │ type T = [number, number]   │ const T = {                    │
│   Type.Number(),               │                             │   type: 'array',               │
│   Type.Number()                │                             │   items: [{                    │
│ ])                             │                             │      type: 'number'            │
│                                │                             │    }, {                        │
│                                │                             │      type: 'number'            │
│                                │                             │    }],                         │
│                                │                             │    additionalItems: false,     │
│                                │                             │    minItems: 2,                │
│                                │                             │    maxItems: 2                 │
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
│   Type.Number()                │                             │      type: 'string'            │
│ ])                             │                             │   }, {                         │
│                                │                             │      type: 'number'            │
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
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Composite([     │ type T = {                  │ const T = {                    │
│   Type.Object({                │   x: number | string        │   type: 'object',              │
│     x: Type.Number()           │   y: number                 │   properties: {                │
│   }),                          │ }                           │     x: {                       │
│   Type.Object({                │                             │       anyOf: [                 │
│     x: Type.String()           │                             │         { type: 'number' },    │
│     y: Type.Number()           │                             │         { type: 'string' }     │
│   })                           │                             │       ]                        │
│ ])                             │                             │     },                         │
│                                │                             │     y: {                       │
│                                │                             │       type: 'number'           │
│                                │                             │     }                          │
│                                │                             │   },                           │
│                                │                             │   required: ['x', 'y']         │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Never()         │ type T = never              │ const T = {                    │
│                                │                             │   allOf: [{                    │
│                                │                             │     type: 'boolean',           │
│                                │                             │     const: false               │
│                                │                             │   }, {                         │
│                                │                             │     type: 'boolean',           │
│                                │                             │     const: true                │
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Not(            | type T = string             │ const T = {                    │
|   Type.Union([                 │                             │   allOf: [{                    │
│     Type.Literal('x'),         │                             │     not: {                     │
│     Type.Literal('y'),         │                             │       anyOf: [                 │
│     Type.Literal('z')          │                             │         { const: 'x' },        │
│   ]),                          │                             │         { const: 'y' },        │
│   Type.String()                │                             │         { const: 'z' }         │
│ )                              │                             │       ]                        │
│                                │                             │     }                          │
│                                │                             │   }, {                         │
│                                │                             │     type: 'string'             │
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
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
│ const T = Type.Record(         │ type T = Record<            │ const T = {                    │
│   Type.String(),               │   string,                   │   type: 'object',              │
│   Type.Number()                │   number,                   │   patternProperties: {         │
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
│     x: Type.Number(),          │   y: number                 │   properties: {                │
│     y: Type.Number()           | }, 'x'>                     │     x: {                       │
│   }), ['x']                    │                             │       type: 'number'           │
│ )                              │                             │     }                          │
│                                │                             │   },                           │
│                                │                             │   required: ['x']              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Omit(           │ type T = Omit<{             │ const T = {                    │
│   Type.Object({                │   x: number,                │   type: 'object',              │
│     x: Type.Number(),          │   y: number                 │   properties: {                │
│     y: Type.Number()           | }, 'x'>                     │     y: {                       │
│   }), ['x']                    │                             │       type: 'number'           │
│ )                              │                             │     }                          │
│                                │                             │   },                           │
│                                │                             │   required: ['y']              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const A = Type.Object({        │ type A = {                  │ const T = {                    │
│    x: Type.Number(),           │   x: number,                │   $ref: 'A'                    │
│    y: Type.Number()            │   y: number                 │ }                              │
│ }, { $id: 'T' })               | }                           │                                │
│                                │                             │                                │
│ const T = Type.Ref(A)          │ type T = A                  │                                │
│                                │                             │                                │
│                                │                             │                                │
│                                │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const A = Type.Object({        │ type T = {                  │ const T = {                    │
│    x: Type.Number(),           │   x: number,                │   $id: 'T'                     │
│    y: Type.Number()            │   y: number                 │   type: 'object',              │
│ }, { $id: 'T' })               | }                           │   required: ['x', 'y'],        │
│                                │                             │   properties: {                │
│ const T = Type.Deref(          │                             │     x: { type: 'number' },     │
│   Type.Ref(A)                  │                             │     y: { type: 'number' },     │
│ )                              │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name='types-extended'></a>

### Extended Types

TypeBox provides several extended types that can be used to produce schematics for common JavaScript constructs. These types cannot be used with standard JSON schema validators; but are useful to help frame schematics for RPC interfaces that may receive JSON validated data. Extended types are prefixed with the `[Extended]` doc comment for convenience.

The following lists the supported types

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ Extended Schema                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Constructor([   │ type T = new (              │ const T = {                    │
│   Type.String(),               │  arg0: string,              │   type: 'object',              │
│   Type.Number()                │  arg1: number               │   instanceOf: 'Constructor',   │
│ ], Type.Boolean())             │ ) => boolean                │   parameters: [{               │
│                                │                             │     type: 'string'             │
│                                │                             │   }, {                         │
│                                │                             │     type: 'number'             │
│                                │                             │   }],                          │
│                                │                             │   return: {                    │
│                                │                             │     type: 'boolean'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Function([      │ type T = (                  │ const T = {                    │
|   Type.String(),               │  arg0: string,              │   type : 'object',             │
│   Type.Number()                │  arg1: number               │   instanceOf: 'Function',      │
│ ], Type.Boolean())             │ ) => boolean                │   parameters: [{               │
│                                │                             │     type: 'string'             │
│                                │                             │   }, {                         │
│                                │                             │     type: 'number'             │
│                                │                             │   }],                          │
│                                │                             │   return: {                    │
│                                │                             │     type: 'boolean'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Promise(        │ type T = Promise<string>    │ const T = {                    │
│   Type.String()                │                             │   type: 'object',              │
│ )                              │                             │   instanceOf: 'Promise',       │
│                                │                             │   item: {                      │
│                                │                             │     type: 'string'             │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uint8Array()    │ type T = Uint8Array         │ const T = {                    │
│                                │                             │   type: 'object',              │
│                                │                             │   instanceOf: 'Uint8Array'     │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Date()          │ type T = Date               │ const T = {                    │
│                                │                             │   type: 'object',              │
│                                │                             │   instanceOf: 'Date'           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Undefined()     │ type T = undefined          │ const T = {                    │
│                                │                             │   type: 'null',                │
│                                │                             │   typeOf: 'Undefined'          │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.RegEx(/foo/)    │ type T = string             │ const T = {                    │
│                                │                             │    type: 'string',             │
│                                │                             │    pattern: 'foo'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Symbol()        │ type T = symbol             │ const T = {                    │
│                                │                             │   type: 'null',                │
│                                │                             │   typeOf: 'Symbol'             │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.BigInt()        │ type T = bigint             │ const T = {                    │
│                                │                             │   type: 'null',                │
│                                │                             │   typeOf: 'BigInt'             │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Void()          │ type T = void               │ const T = {                    │
│                                │                             │   type: 'null'                 │
│                                │                             │   typeOf: 'Void'               │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name='types-modifiers'></a>

### Modifiers

TypeBox provides property modifier types that allow properties to be mapped with TypeScript `readonly` and `optional`. The following table shows the modifier types and how they map between TypeScript and JSON Schema.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ JSON Schema                    │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.Optional(         │   name?: string             │   type: 'object',              │
│     Type.String()              │ }                           │   properties: {                │
│   )                            │                             │      name: {                   │
│ })  	                         │                             │        type: 'string'          │
│                                │                             │      }                         │
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
│   name: Type.ReadonlyOptional( │   readonly name?: string    │   type: 'object',              │
│     Type.String()              │ }                           │   properties: {                │
│   )                            │                             │     name: {                    │
│ })  	                         │                             │       type: 'string'           │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name='types-options'></a>

### Options

You can pass JSON Schema compliant options on the last argument of any type. Option property hints are provided for convenience.

```typescript
// String must be an email
const T = Type.String({                              // const T = { 
  format: 'email'                                    //   type: 'string',
})                                                   //   format: 'email' 
                                                     // }

// Mumber must be a multiple of 2
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

<a name='types-generics'></a>

### Generic Types

Generic types can be created with generic functions. The following creates a generic `Vector<T>` type. 

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

const BooleanVector = Vector(Type.Boolean())         // const BooleanVector = {
                                                     //   type: 'object',
                                                     //   required: ['x', 'y', 'z'],
                                                     //   properties: {
                                                     //     x: { type: 'boolean' },
                                                     //     y: { type: 'boolean' },
                                                     //     z: { type: 'boolean' }
                                                     //   }
                                                     // }
```

<a name='types-references'></a>

### Reference Types

Reference types are supported with `Type.Ref(...)`. Use `Type.Deref(...)` to dereference a type. 

```typescript
const T = Type.String({ $id: 'T' })                  // const T = {
                                                     //    $id: 'T',
                                                     //    type: 'string'
                                                     // }
                                             
const R = Type.Ref(T)                                // const R = {
                                                     //    $ref: 'T'
                                                     // }

const U = Type.Deref(R)                              // const U = {
                                                     //    $id: 'T',
                                                     //    type: 'string'
                                                     // }
```

<a name='types-recursive'></a>

### Recursive Types

Recursive types are supported with `Type.Recursive(...)`.

```typescript
const Node = Type.Recursive(Node => Type.Object({    // const Node = {
  id: Type.String(),                                 //   $id: 'Node',
  nodes: Type.Array(Node)                            //   type: 'object',
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

Conditional types are supported with `Extends`, `Exclude` and `Extract`. These work the same as in TypeScript.

#### TypeScript

```typescript
type T0 = string extends number ? true : false                                                 
//   ^ false
type T1 = Extract<string | number, number>                                                     
//   ^ number
type T2 = Exclude<string | number, number>                                                     
//   ^ string
```
#### TypeBox
```typescript
const T0 = Type.Extends(Type.String(), Type.Number(), Type.Literal(true), Type.Literal(false)) 
//    ^ TLiteral<false>
const T1 = Type.Extract(Type.Union([Type.String(), Type.Number()]), Type.Number())             
//    ^ TNumber
const T2 = Type.Exclude(Type.Union([Type.String(), Type.Number()]), Type.Number())             
//    ^ TString<string>
```

<a name='types-unsafe'></a>

### Unsafe

Use `Type.Unsafe(...)` to create custom schemas with user defined inference rules.

```typescript
const T = Type.Unsafe<string>({ type: 'number' })    // const T = {
                                                     //   type: 'number'
                                                     // }

type T = Static<typeof T>                            // type T = string
```

The `Type.Unsafe(...)` type allows for the expression of specific OpenAPI schema representations.

```typescript
import { Type, Static, TSchema } from '@sinclair/typebox'

// Nullable<T>

function Nullable<T extends TSchema>(schema: T) {
  return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true })
}

const T = Nullable(Type.String())                    // const T = {
                                                     //   type: 'string',
                                                     //   nullable: true
                                                     // }

type T = Static<typeof T>                            // type T = string | null

// StringEnum<string[]>

function StringEnum<T extends string[]>(values: [...T]) {
  return Type.Unsafe<T[number]>({ type: 'string', enum: values })
}

const T = StringEnum(['A', 'B', 'C'])                // const T = {
                                                     //   enum: ['A', 'B', 'C']
                                                     // }

type T = Static<typeof T>                            // type T = 'A' | 'B' | 'C'
```

<a name='types-guards'></a>

### Guards

TypeBox provides a `TypeGuard` module for reflection and type assertion.

```typescript
import { Type, TypeGuard } from '@sinclair/typebox'

const T = Type.String()

if(TypeGuard.TString(T)) {
    
  // T is TString
}
```

<a name='types-strict'></a>

### Strict

TypeBox schemas contain the `Kind` and `Modifier` symbol properties. These properties are used for type composition and runtime type reflection. These properties are not strictly valid JSON schema; so in some cases it may be desirable to omit them. TypeBox provides a `Type.Strict()` function that will omit these properties if necessary.

```typescript
const T = Type.Object({                              // const T = {
  name: Type.Optional(Type.String())                 //   [Kind]: 'Object',
})                                                   //   type: 'object',
                                                     //   properties: {
                                                     //     name: {
                                                     //       [Kind]: 'String',
                                                     //       type: 'string',
                                                     //       [Modifier]: 'Optional'
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

TypeBox provides an optional utility module that can be used to perform common operations on JavaScript values. This module includes functionality to create, check and cast values from types as well as check equality, clone, diff and patch JavaScript values. This module is provided via additional import.

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

Use the Clone function to deeply clone a value

```typescript
const A = Value.Clone({ x: 1, y: 2, z: 3 })          // const A = { x: 1, y: 2, z: 3 }
```

<a name='values-check'></a>

### Check

Use the Check function to type check a value

```typescript
const T = Type.Object({ x: Type.Number() })

const R = Value.Check(T, { x: 1 })                   // const R = true
```

<a name='values-convert'></a>

### Convert

Use the Convert function to convert a value into its target type if a reasonable conversion is possible.

```typescript
const T = Type.Object({ x: Type.Number(), y: Type.Number() })

const R1 = Value.Convert(T, { x: '3.14' })          // const R1 = { x: 3.14 }

const R2 = Value.Convert(T, { x: 'not a number' })  // const R2 = { x: 'not a number' }
```

<a name='values-cast'></a>

### Cast

Use the Cast function to cast a value into a type. The cast function will retain as much information as possible from the original value.

```typescript
const T = Type.Object({ x: Type.Number(), y: Type.Number() }, { additionalProperties: false })

const X = Value.Cast(T, null)                        // const X = { x: 0, y: 0 }

const Y = Value.Cast(T, { x: 1 })                    // const Y = { x: 1, y: 0 }

const Z = Value.Cast(T, { x: 1, y: 2, z: 3 })        // const Z = { x: 1, y: 2 }
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
const A = Value.Hash({ x: 1, y: 2, z: 3 })          // const A = 2910466848807138541n

const B = Value.Hash({ x: 1, y: 4, z: 3 })          // const B = 1418369778807423581n
```

<a name='values-diff'></a>

### Diff

Use the Diff function to produce a sequence of edits to transform one value into another.

```typescript
const E = Value.Diff(                               // const E = [
  { x: 1, y: 2, z: 3 },                             //   { type: 'update', path: '/y', value: 4 },
  { y: 4, z: 5, w: 6 }                              //   { type: 'update', path: '/z', value: 5 },
)                                                   //   { type: 'insert', path: '/w', value: 6 },
                                                    //   { type: 'delete', path: '/x' }
                                                    // ]
```

<a name='values-patch'></a>

### Patch

Use the Patch function to apply edits

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

Use the Errors function enumerate validation errors.

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

<a name='values-pointer'></a>

### Pointer

Use ValuePointer to perform mutable updates on existing values using [RFC6901](https://www.rfc-editor.org/rfc/rfc6901) JSON Pointers.

```typescript
import { ValuePointer } from '@sinclair/typebox/value'

const A = { x: 0, y: 0, z: 0 }

ValuePointer.Set(A, '/x', 1)                         // const A = { x: 1, y: 0, z: 0 }
ValuePointer.Set(A, '/y', 1)                         // const A = { x: 1, y: 1, z: 0 }
ValuePointer.Set(A, '/z', 1)                         // const A = { x: 1, y: 1, z: 1 }
```
<a name='typecheck'></a>

## TypeCheck

TypeBox types targets JSON Schema draft 6 so is immediately compatible with any validator that supports this specification. TypeBox also provides a built in type checking compiler designed specifically for high performance compilation and value assertion.

The following details using both Ajv and TypeBox's compiler infrastructure.

<a name='typecheck-ajv'></a>

## Ajv

The following shows the recommended setup for Ajv with additional string formats.

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

const C = ajv.compile(Type.Object({                
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}))

const R = C({ x: 1, y: 2, z: 3 })                    // const R = true 
```

<a name='typecheck-typecompiler'></a>

### TypeCompiler

The TypeBox TypeCompiler is a high performance JIT compiler that compiles TypeBox types into optimized JavaScript validation routines. The compiler is tuned both for fast compilation and value assertion. It is designed primarily for integrating into application frameworks but can also be used as a general purpose validator.

The TypeCompiler is provided as an optional import.

```typescript
import { TypeCompiler } from '@sinclair/typebox/compiler'
```

Use the `Compile(...)` function to compile a type.

```typescript
const C = TypeCompiler.Compile(Type.Object({         // const C: TypeCheck<TObject<{
  x: Type.Number(),                                  //     x: TNumber;
  y: Type.Number(),                                  //     y: TNumber;
  z: Type.Number()                                   //     z: TNumber;
}))                                                  // }>>

const R = C.Check({ x: 1, y: 2, z: 3 })              // const R = true
```

Use the `Errors(...)` function to produce diagnostics for a value. The `Errors(...)` function will return an iterator that will perform an exhaustive check across the value and yield any error found. For performance, this function should only be called after failed `Check(...)`.

```typescript
const C = TypeCompiler.Compile(Type.Object({         // const C: TypeCheck<TObject<{
  x: Type.Number(),                                  //     x: TNumber;
  y: Type.Number(),                                  //     y: TNumber;
  z: Type.Number()                                   //     z: TNumber;
}))                                                  // }>>

const value = { }

const errors = [...C.Errors(value)]                  // const errors = [{
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

Compiled routines can be inspected with the `.Code()` function.

```typescript
const C = TypeCompiler.Compile(Type.String())        // const C: TypeCheck<TString>

console.log(C.Code())                                // return function check(value) {
                                                     //   return (
                                                     //     (typeof value === 'string')
                                                     //   )
                                                     // }
```

<a name='typesystem'></a>

## TypeSystem

The TypeBox TypeSystem module provides functionality to define types above and beyond the Standard and Extended type sets as well as control various assertion polices. Configurations made to the TypeSystem module are observed by both `TypeCompiler` and `Value` modules.

The TypeSystem module is provided as an optional import.

```typescript
import { TypeSystem } from '@sinclair/typebox/system'
```

<a name='typesystem-types'></a>

### Types

Use the `Type(...)` function to create a custom type. This function will return a type factory function that can be used to construct the type. The following creates a Point type.

```typescript
type PointOptions = { }                              // The Type Options

type PointType = { x: number, y: number }            // The Static<T> Type

const Point = TypeSystem.Type<PointType, PointOptions>('Point', (options, value) => {
  return (
    typeof value === 'object' && value !== null &&
    typeof value.x === 'number' && 
    typeof value.y === 'number'
  )
})

const T = Point()

type T = Static<typeof T>                             // type T = { x: number, y: number }

const R = Value.Check(T, { x: 1, y: 2 })              // const R = true
```

<a name='typesystem-formats'></a>

### Formats

Use the `Format(...)` function to create a custom string formats. The following creates a custom string format that checks for lowercase strings.

```typescript
TypeSystem.Format('lowercase', value => value === value.toLowerCase()) // format should be lowercase

const T = Type.String({ format: 'lowercase' })       

const A = Value.Check(T, 'action')                   // const A = true

const B = Value.Check(T, 'ACTION')                   // const B = false
```

<a name='typesystem-policies'></a>

### Policies

TypeBox validates using JSON Schema assertion policies by default. It is possible to override these policies and have TypeBox assert using TypeScript policies. The following overrides are available.

```typescript
// Allow arrays to validate as object types (default is false)
//
// const A: {} = [] - allowed in TS

TypeSystem.AllowArrayObjects = true                  

// Allow numeric values to be NaN or + or - Infinity (default is false)
//
// const A: number = NaN - allowed in TS

TypeSystem.AllowNaN = true                      
```

<a name='benchmark'></a>

## Benchmark

This project maintains a set of benchmarks that measure Ajv, Value and TypeCompiler compilation and validation performance. These benchmarks can be run locally by cloning this repository and running `npm run benchmark`. The results below show for Ajv version 8.11.2. 

For additional comparative benchmarks, please refer to [typescript-runtime-type-benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/).

<a name='benchmark-compile'></a>

### Compile

This benchmark measures compilation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/compile.ts).

```typescript
┌──────────────────┬────────────┬──────────────┬──────────────┬──────────────┐
│     (index)      │ Iterations │     Ajv      │ TypeCompiler │ Performance  │
├──────────────────┼────────────┼──────────────┼──────────────┼──────────────┤
│           Number │    2000    │ '    451 ms' │ '     16 ms' │ '   28.19 x' │
│           String │    2000    │ '    338 ms' │ '     14 ms' │ '   24.14 x' │
│          Boolean │    2000    │ '    297 ms' │ '     13 ms' │ '   22.85 x' │
│             Null │    2000    │ '    265 ms' │ '      8 ms' │ '   33.13 x' │
│            RegEx │    2000    │ '    492 ms' │ '     18 ms' │ '   27.33 x' │
│          ObjectA │    2000    │ '   2744 ms' │ '     55 ms' │ '   49.89 x' │
│          ObjectB │    2000    │ '   3005 ms' │ '     44 ms' │ '   68.30 x' │
│            Tuple │    2000    │ '   1283 ms' │ '     26 ms' │ '   49.35 x' │
│            Union │    2000    │ '   1263 ms' │ '     27 ms' │ '   46.78 x' │
│          Vector4 │    2000    │ '   1622 ms' │ '     23 ms' │ '   70.52 x' │
│          Matrix4 │    2000    │ '    888 ms' │ '     12 ms' │ '   74.00 x' │
│   Literal_String │    2000    │ '    344 ms' │ '     14 ms' │ '   24.57 x' │
│   Literal_Number │    2000    │ '    389 ms' │ '      8 ms' │ '   48.63 x' │
│  Literal_Boolean │    2000    │ '    374 ms' │ '      9 ms' │ '   41.56 x' │
│     Array_Number │    2000    │ '    710 ms' │ '     12 ms' │ '   59.17 x' │
│     Array_String │    2000    │ '    739 ms' │ '      9 ms' │ '   82.11 x' │
│    Array_Boolean │    2000    │ '    732 ms' │ '      7 ms' │ '  104.57 x' │
│    Array_ObjectA │    2000    │ '   3733 ms' │ '     42 ms' │ '   88.88 x' │
│    Array_ObjectB │    2000    │ '   3602 ms' │ '     42 ms' │ '   85.76 x' │
│      Array_Tuple │    2000    │ '   2204 ms' │ '     20 ms' │ '  110.20 x' │
│      Array_Union │    2000    │ '   1533 ms' │ '     24 ms' │ '   63.88 x' │
│    Array_Vector4 │    2000    │ '   2263 ms' │ '     21 ms' │ '  107.76 x' │
│    Array_Matrix4 │    2000    │ '   1576 ms' │ '     14 ms' │ '  112.57 x' │
└──────────────────┴────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-validate'></a>

### Validate

This benchmark measures validation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/check.ts).

```typescript
┌──────────────────┬────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│     (index)      │ Iterations │  ValueCheck  │     Ajv      │ TypeCompiler │ Performance  │
├──────────────────┼────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│           Number │  1000000   │ '     30 ms' │ '      7 ms' │ '      6 ms' │ '    1.17 x' │
│           String │  1000000   │ '     23 ms' │ '     21 ms' │ '     11 ms' │ '    1.91 x' │
│          Boolean │  1000000   │ '     22 ms' │ '     21 ms' │ '     10 ms' │ '    2.10 x' │
│             Null │  1000000   │ '     27 ms' │ '     20 ms' │ '     10 ms' │ '    2.00 x' │
│            RegEx │  1000000   │ '    163 ms' │ '     47 ms' │ '     38 ms' │ '    1.24 x' │
│          ObjectA │  1000000   │ '    654 ms' │ '     41 ms' │ '     24 ms' │ '    1.71 x' │
│          ObjectB │  1000000   │ '   1173 ms' │ '     59 ms' │ '     41 ms' │ '    1.44 x' │
│            Tuple │  1000000   │ '    124 ms' │ '     24 ms' │ '     17 ms' │ '    1.41 x' │
│            Union │  1000000   │ '    332 ms' │ '     26 ms' │ '     16 ms' │ '    1.63 x' │
│        Recursive │  1000000   │ '   3129 ms' │ '    412 ms' │ '    102 ms' │ '    4.04 x' │
│          Vector4 │  1000000   │ '    147 ms' │ '     26 ms' │ '     13 ms' │ '    2.00 x' │
│          Matrix4 │  1000000   │ '    576 ms' │ '     41 ms' │ '     28 ms' │ '    1.46 x' │
│   Literal_String │  1000000   │ '     51 ms' │ '     21 ms' │ '     10 ms' │ '    2.10 x' │
│   Literal_Number │  1000000   │ '     47 ms' │ '     21 ms' │ '     11 ms' │ '    1.91 x' │
│  Literal_Boolean │  1000000   │ '     47 ms' │ '     21 ms' │ '     10 ms' │ '    2.10 x' │
│     Array_Number │  1000000   │ '    490 ms' │ '     33 ms' │ '     18 ms' │ '    1.83 x' │
│     Array_String │  1000000   │ '    502 ms' │ '     31 ms' │ '     25 ms' │ '    1.24 x' │
│    Array_Boolean │  1000000   │ '    465 ms' │ '     33 ms' │ '     27 ms' │ '    1.22 x' │
│    Array_ObjectA │  1000000   │ '  15463 ms' │ '   2470 ms' │ '   2052 ms' │ '    1.20 x' │
│    Array_ObjectB │  1000000   │ '  18047 ms' │ '   2497 ms' │ '   2348 ms' │ '    1.06 x' │
│      Array_Tuple │  1000000   │ '   1958 ms' │ '     99 ms' │ '     77 ms' │ '    1.29 x' │
│      Array_Union │  1000000   │ '   5348 ms' │ '    254 ms' │ '     89 ms' │ '    2.85 x' │
│  Array_Recursive │  1000000   │ '  54643 ms' │ '   8870 ms' │ '   1158 ms' │ '    7.66 x' │
│    Array_Vector4 │  1000000   │ '   2724 ms' │ '    105 ms' │ '     48 ms' │ '    2.19 x' │
│    Array_Matrix4 │  1000000   │ '  13821 ms' │ '    437 ms' │ '    266 ms' │ '    1.64 x' │
└──────────────────┴────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-compression'></a>

### Compression

The following table lists esbuild compiled and minified sizes for each TypeBox module.

```typescript
┌──────────────────────┬────────────┬────────────┬─────────────┐
│       (index)        │  Compiled  │  Minified  │ Compression │
├──────────────────────┼────────────┼────────────┼─────────────┤
│ typebox/compiler     │ ' 65.4 kb' │ ' 32.2 kb' │  '2.03 x'   │
│ typebox/conditional  │ ' 45.5 kb' │ ' 18.6 kb' │  '2.45 x'   │
│ typebox/custom       │ '  0.6 kb' │ '  0.2 kb' │  '2.61 x'   │
│ typebox/format       │ '  0.6 kb' │ '  0.2 kb' │  '2.66 x'   │
│ typebox/guard        │ ' 23.8 kb' │ ' 11.4 kb' │  '2.08 x'   │
│ typebox/hash         │ '  4.2 kb' │ '  1.8 kb' │  '2.30 x'   │
│ typebox/system       │ ' 14.0 kb' │ '  7.1 kb' │  '1.96 x'   │
│ typebox/value        │ ' 90.0 kb' │ ' 41.8 kb' │  '2.15 x'   │
│ typebox              │ ' 12.0 kb' │ '  6.4 kb' │  '1.89 x'   │
└──────────────────────┴────────────┴────────────┴─────────────┘
```

<a name='contribute'></a>

## Contribute

TypeBox is open to community contribution. Please ensure you submit an open issue before submitting your pull request. The TypeBox project preferences open community discussion prior to accepting new features.
