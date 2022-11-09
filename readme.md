<div align='center'>

<h1>TypeBox</h1>

<p>JSON Schema Type Builder with Static Type Resolution for TypeScript</p>
	
<img src="https://github.com/sinclairzx81/typebox/blob/master/typebox.png?raw=true" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox.svg)](https://badge.fury.io/js/%40sinclair%2Ftypebox)
[![Downloads](https://img.shields.io/npm/dm/%40sinclair%2Ftypebox.svg)](https://www.npmjs.com/package/%40sinclair%2Ftypebox)
[![GitHub CI](https://github.com/sinclairzx81/typebox/workflows/GitHub%20CI/badge.svg)](https://github.com/sinclairzx81/typebox/actions)

</div>

<a name="Install"></a>

## Install

Node

```bash
$ npm install @sinclair/typebox --save
```

Deno and ESM

```typescript
import { Static, Type } from 'https://esm.sh/@sinclair/typebox'
```

## Example

```typescript
import { Static, Type } from '@sinclair/typebox'

const T = Type.String()     // const T = { type: 'string' }

type T = Static<typeof T>   // type T = string
```

<a name="Overview"></a>

## Overview

TypeBox is a type builder library that creates in-memory JSON Schema objects that can be statically inferred as TypeScript types. The schemas produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox enables one to create a unified type that can be statically checked by TypeScript and runtime asserted using standard JSON Schema validation.

TypeBox is designed to enable JSON schema to compose with the same flexibility as TypeScript's type system. It can be used either as a simple tool to build up complex schemas or integrated into REST and RPC services to help validate data received over the wire. 

License MIT

## Contents
- [Install](#install)
- [Overview](#overview)
- [Usage](#usage)
- [Types](#types)
  - [Standard Types](#types-standard)
  - [Extended Types](#types-extended)
  - [Modifiers](#types-modifiers)
  - [Options](#types-options)
  - [Reference](#types-reference)
  - [Recursive](#types-recursive)
  - [Generic](#types-generic)
  - [Conditional](#types-conditional)
  - [Unsafe](#types-unsafe)
  - [Guards](#types-guards)
  - [Strict](#types-strict)
- [Values](#values)
  - [Create](#values-create)
  - [Clone](#values-clone)
  - [Check](#values-check)
  - [Cast](#values-cast)
  - [Equal](#values-equal)
  - [Diff](#values-diff)
  - [Patch](#values-patch)
  - [Errors](#values-errors)
  - [Pointer](#values-pointer)
- [TypeCheck](#typecheck)
  - [Ajv](#typecheck-ajv)
  - [TypeCompiler](#typecheck-typecompiler)
  - [Formats](#typecheck-formats)
- [Benchmark](#benchmark)
  - [Compile](#benchmark-compile)
  - [Validate](#benchmark-validate)
  - [Compression](#benchmark-compression)
- [Contribute](#contribute)

<a name="Example"></a>

## Usage

The following demonstrates TypeBox's general usage.

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

function receive(value: T) {                         // ... as a Type

  if(JSON.validate(T, value)) {                      // ... as a Schema
  
    // ok...
  }
}
```

<a name='types'></a>

## Types

TypeBox provides a set of functions that allow you to compose JSON Schema similar to how you would compose static types with TypeScript. Each function creates a JSON schema fragment which can compose into more complex types. The schemas produced by TypeBox can be passed directly to any JSON Schema compliant validator, or used to reflect runtime metadata for a type.

<a name='types-standard'></a>

### Standard Types

The following table lists the Standard TypeBox types.

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
│ const T = Type.RegEx(/foo/)    │ type T = string             │ const T = {                    │
│                                │                             │    type: 'string',             │
│                                │                             │    pattern: 'foo'              │
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
│   y: Type.Number()             │   y: number                 │   properties: {                │
│ })                             │ }                           │      x: {                      │
│                                │                             │        type: 'number'          │
│                                │                             │      },                        │
│                                │                             │      y: {                      │
│                                │                             │        type: 'number'          │
│                                │                             │      }                         │
│                                │                             │   },                           │
│                                │                             │   required: ['x', 'y']         │
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
│   Type.Object({                │   x: number                 │   type: 'object',              │
│     x: Type.Number()           │ } & {                       │   properties: {                │
│   }),                          │   y: number                 │     x: {                       │
│   Type.Object({                │ }                           │       type: 'number'           │
│     y: Type.Number()           │                             │     },                         │
│   })                           │                             │     y: {                       │
│ ])                             │                             │       type: 'number'           │
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
│     x: Type.Optional(          │   y?: number                │   properties: {                │
│       Type.Number()            | }>                          │     x: {                       │
│     ),                         │                             │       type: 'number'           │
│     y: Type.Optional(          │                             │     },                         │
│       Type.Number()            │                             │     y: {                       │
│     )                          │                             │       type: 'number'           │
│   })                           │                             │     }                          │
│ )                              │                             │   },                           │
│                                │                             │   required: ['x', 'y']         │
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
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name='types-extended'></a>

### Extended Types

TypeBox provides a set of extended types that can be used to express schematics for core JavaScript constructs and primitives. Extended types are not valid JSON Schema and will not validate using typical validation. These types however can be used to frame JSON schema and describe callable RPC interfaces that may receive JSON validated data.

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
│ const T = Type.Void()          │ type T = void               │ const T = {                    │
│                                │                             │   type: 'null'                 │
│                                │                             │   typeOf: 'Void'               │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name='types-modifiers'></a>

### Modifiers

TypeBox provides modifiers that can be applied to an objects properties. This allows for `optional` and `readonly` to be applied to that property. The following table illustates how they map between TypeScript and JSON Schema.

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

You can pass additional JSON schema options on the last argument of any given type. The following are some examples.

```typescript
// string must be an email
const T = Type.String({ format: 'email' })

// number must be a multiple of 2
const T = Type.Number({ multipleOf: 2 })

// array must have at least 5 integer values
const T = Type.Array(Type.Integer(), { minItems: 5 })
```

<a name='types-reference'></a>

### Reference

Use `Type.Ref(...)` to create referenced types. The target type must specify an `$id`.

```typescript
const T = Type.String({ $id: 'T' })                  // const T = {
                                                     //    $id: 'T',
                                                     //    type: 'string'
                                                     // }
                                             
const R = Type.Ref(T)                                // const R = {
                                                     //    $ref: 'T'
                                                     // }
```

<a name='types-recursive'></a>

### Recursive

Use `Type.Recursive(...)` to create recursive types.

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
  const id = node.nodes[0].nodes[0]                  // id is string
                 .nodes[0].nodes[0]
                 .id
}
```

<a name='types-generic'></a>

### Generic

Use functions to create generic types. The following creates a generic `Nullable<T>` type. 

```typescript
import { Type, Static, TSchema } from '@sinclair/typebox'

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()])

const T = Nullable(Type.String())                    // const T = {
                                                     //   anyOf: [{
                                                     //     type: 'string'
                                                     //   }, {
                                                     //     type: 'null'
                                                     //   }]
                                                     // }

type T = Static<typeof T>                            // type T = string | null

const U = Nullable(Type.Number())                    // const U = {
                                                     //   anyOf: [{
                                                     //     type: 'number'
                                                     //   }, {
                                                     //     type: 'null'
                                                     //   }]
                                                     // }

type U = Static<typeof U>                            // type U = number | null
```

<a name='types-conditional'></a>

### Conditional

Use the conditional module to create [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html). This module implements TypeScript's structural equivalence checks to enable TypeBox types to be conditionally inferred at runtime. This module also provides the [Extract](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union) and [Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers) utility types which are expressed as conditional types in TypeScript. 

The conditional module is provided as an optional import.

```typescript
import { Conditional } from '@sinclair/typebox/conditional'
```
The following table shows the TypeBox mappings between TypeScript and JSON schema.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ JSON Schema                    │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Conditional.Extends( │ type T =                    │ const T = {                    │
│   Type.String(),               │  string extends number      │   const: false,                │
│   Type.Number(),               │  true : false               │   type: 'boolean'              │
│   Type.Literal(true),          │                             │ }                              │
│   Type.Literal(false)          │                             │                                │
│ )                              │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Conditional.Extract( │ type T = Extract<           │ const T = {                    │
│   Type.Union([                 │   'a' | 'b' | 'c',          │   anyOf: [{                    │
│     Type.Literal('a'),         │   'a' | 'f'                 │     const: 'a'                 │
│     Type.Literal('b'),         │ >                           │     type: 'string'             │
│     Type.Literal('c')          │                             │   }]                           │
│   ]),                          │                             │ }                              │
│   Type.Union([                 │                             │                                │
│     Type.Literal('a'),         │                             │                                │
│     Type.Literal('f')          │                             │                                │
│   ])                           │                             │                                │
│ )                              │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Conditional.Exclude( │ type T = Exclude<           │ const T = {                    │
│   Type.Union([                 │   'a' | 'b' | 'c',          │   anyOf: [{                    │
│     Type.Literal('a'),         │   'a'                       │     const: 'b',                │
│     Type.Literal('b'),         │ >                           │     type: 'string'             │
│     Type.Literal('c')          │                             │   }, {                         │
│   ]),                          │                             │     const: 'c',                │
│   Type.Union([                 │                             │     type: 'string'             │
│     Type.Literal('a')          │                             │   }]                           │
│   ])                           │                             │ }                              │
│ )                              │                             │                                │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
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

This function can be used to create custom schemas for validators that require specific schema representations. An example of this might be OpenAPI's `nullable` and `enum` schemas which are not provided by TypeBox. The following demonstrates using `Type.Unsafe(...)` to create these types.

```typescript
import { Type, Static, TSchema } from '@sinclair/typebox'

//--------------------------------------------------------------------------------------------
//
// Nullable<T>
//
//--------------------------------------------------------------------------------------------

function Nullable<T extends TSchema>(schema: T) {
  return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true })
}

const T = Nullable(Type.String())                    // const T = {
                                                     //   type: 'string',
                                                     //   nullable: true
                                                     // }

type T = Static<typeof T>                            // type T = string | null


//--------------------------------------------------------------------------------------------
//
// StringEnum<string[]>
//
//--------------------------------------------------------------------------------------------

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

Use the guard module to test if values are TypeBox types.

```typescript
import { TypeGuard } from '@sinclair/typebox/guard'

const T = Type.String()

if(TypeGuard.TString(T)) {
    
  // T is TString
}
```

<a name='types-strict'></a>

### Strict

TypeBox schemas contain the `Kind` and `Modifier` symbol properties. These properties are provided to enable runtime type reflection on schemas, as well as helping TypeBox internally compose types. These properties are not strictly valid JSON schema; so in some cases it may be desirable to omit them. TypeBox provides a `Type.Strict()` function that will omit these properties if necessary.

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

TypeBox includes an optional values module that can be used to perform common operations on JavaScript values. This module enables one to create, check and cast values from types. It also provides functionality to check equality, clone and diff and patch JavaScript values. The value module is provided as an optional import.

```typescript
import { Value } from '@sinclair/typebox/value'
```

<a name='values-create'></a>

### Create

Use the Create function to create a value from a TypeBox type. TypeBox will use default values if specified.

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

Use ValuePointer to perform mutable updates on existing values using [RFC6901](https://www.rfc-editor.org/rfc/rfc6901) Json Pointers.

```typescript
import { ValuePointer } from '@sinclair/typebox/value'

const A = { x: 0, y: 0, z: 0 }

ValuePointer.Set(A, '/x', 1)                         // const A = { x: 1, y: 0, z: 0 }
ValuePointer.Set(A, '/y', 1)                         // const A = { x: 1, y: 1, z: 0 }
ValuePointer.Set(A, '/z', 1)                         // const A = { x: 1, y: 1, z: 1 }
```
<a name='typecheck'></a>

## TypeCheck

TypeBox targets JSON Schema Draft 6 and is built and tested against the Ajv JSON Schema validator for standards compliance. TypeBox also includes an optional built-in TypeCompiler that can provide improved compilation and validation performance specifically for TypeBox types only.

The following sections detail using these validators.

<a name='typecheck-ajv'></a>

### Ajv

The following are the recommended configurations to support both the [Standard](#standard) and [Extended](#extended) type sets provided by TypeBox. For schema portability and publishing to remote systems, it is recommended to use the Standard type set only.

```bash
$ npm install ajv ajv-formats --save
```

<details>

<summary>
<strong>Standard Ajv Configuration</strong>
<p>Expand for Standard Type Set Configuration</p>
</summary>

```typescript
import { Type }   from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv        from 'ajv'

export function createAjv() {
  return addFormats(new Ajv({}), [
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
}

const ajv = createAjv()

const R = ajv.validate(Type.Object({                 // const R = true
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}), { x: 1, y: 2, z: 3 })     
```

</details>

<details>

<summary>
<strong>Extended Ajv Configuration</strong>
<p>Expand for Extended Type Set Configuration</p>
</summary>

```typescript
import { TypeGuard } from '@sinclair/typebox/guard'
import { Value }     from '@sinclair/typebox/value'
import { Type }      from '@sinclair/typebox'
import addFormats    from 'ajv-formats'
import Ajv           from 'ajv'

function schemaOf(schemaOf: string, value: unknown, schema: unknown) {
  switch (schemaOf) {
    case 'Constructor':
      return TypeGuard.TConstructor(schema) && Value.Check(schema, value) // not supported
    case 'Function':
      return TypeGuard.TFunction(schema) && Value.Check(schema, value) // not supported
    case 'Date':
      return TypeGuard.TDate(schema) && Value.Check(schema, value)
    case 'Promise':
      return TypeGuard.TPromise(schema) && Value.Check(schema, value) // not supported
    case 'Uint8Array':
      return TypeGuard.TUint8Array(schema) && Value.Check(schema, value)
    case 'Undefined':
      return TypeGuard.TUndefined(schema) && Value.Check(schema, value) // not supported
    case 'Void':
      return TypeGuard.TVoid(schema) && Value.Check(schema, value)
    default:
      return false
  }
}

export function createAjv() {
  return addFormats(new Ajv({}), [
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
  .addKeyword({ type: 'object', keyword: 'instanceOf', validate: schemaOf })
  .addKeyword({ type: 'null', keyword: 'typeOf', validate: schemaOf })
  .addKeyword('exclusiveMinimumTimestamp')
  .addKeyword('exclusiveMaximumTimestamp')
  .addKeyword('minimumTimestamp')
  .addKeyword('maximumTimestamp')
  .addKeyword('minByteLength')
  .addKeyword('maxByteLength')
}

const ajv = createAjv()

const R = ajv.validate(Type.Object({                 // const R = true
  buffer: Type.Uint8Array(),
  date: Type.Date(),
  void: Type.Void()
}), {
  buffer: new Uint8Array(),
  date: new Date(),
  void: null
})
```

</details>


<a name='typecheck-typecompiler'></a>

### TypeCompiler

TypeBox provides an optional high performance just-in-time (JIT) compiler and type checker that can be used in applications that require extremely fast validation. Note that this compiler is optimized for TypeBox types only where the schematics are known in advance. If defining custom types with `Type.Unsafe<T>` please consider Ajv.

The compiler module is provided as an optional import.

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

Validation errors can be read with the `Errors(...)` function.

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

<a name='typecheck-formats'></a>

### Formats

Use the format module to create user defined string formats. The format module is used by the Value and TypeCompiler modules only. If using Ajv, please refer to the official Ajv format documentation located [here](https://ajv.js.org/guide/formats.html).

The format module is an optional import.

```typescript
import { Format } from '@sinclair/typebox/format'
```

The following creates a `palindrome` string format.

```typescript
Format.Set('palindrome', value => value === value.split('').reverse().join(''))
```

Once set, this format can then be used by the TypeCompiler and Value modules.

```typescript
const T = Type.String({ format: 'palindrome' })

const A = TypeCompiler.Compile(T).Check('engine')    // const A = false

const B = Value.Check(T, 'kayak')                    // const B = true
```

<a name='benchmark'></a>

## Benchmark

This project maintains a set of benchmarks that measure Ajv, Value and TypeCompiler compilation and validation performance. These benchmarks can be run locally by cloning this repository and running `npm run benchmark`. The results below show for Ajv version 8.11.0. 

For additional comparative benchmarks, please refer to [typescript-runtime-type-benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/).

<a name='benchmark-compile'></a>

### Compile

This benchmark measures compilation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/compile.ts).

```typescript
┌──────────────────┬────────────┬──────────────┬──────────────┬──────────────┐
│     (index)      │ Iterations │     Ajv      │ TypeCompiler │ Performance  │
├──────────────────┼────────────┼──────────────┼──────────────┼──────────────┤
│           Number │    2000    │ '    421 ms' │ '     11 ms' │ '   38.27 x' │
│           String │    2000    │ '    332 ms' │ '     11 ms' │ '   30.18 x' │
│          Boolean │    2000    │ '    291 ms' │ '     12 ms' │ '   24.25 x' │
│             Null │    2000    │ '    266 ms' │ '      9 ms' │ '   29.56 x' │
│            RegEx │    2000    │ '    486 ms' │ '     17 ms' │ '   28.59 x' │
│          ObjectA │    2000    │ '   2791 ms' │ '     50 ms' │ '   55.82 x' │
│          ObjectB │    2000    │ '   2896 ms' │ '     37 ms' │ '   78.27 x' │
│            Tuple │    2000    │ '   1244 ms' │ '     21 ms' │ '   59.24 x' │
│            Union │    2000    │ '   1258 ms' │ '     25 ms' │ '   50.32 x' │
│          Vector4 │    2000    │ '   1513 ms' │ '     21 ms' │ '   72.05 x' │
│          Matrix4 │    2000    │ '    850 ms' │ '     11 ms' │ '   77.27 x' │
│   Literal_String │    2000    │ '    335 ms' │ '      7 ms' │ '   47.86 x' │
│   Literal_Number │    2000    │ '    358 ms' │ '      7 ms' │ '   51.14 x' │
│  Literal_Boolean │    2000    │ '    356 ms' │ '      7 ms' │ '   50.86 x' │
│     Array_Number │    2000    │ '    689 ms' │ '      9 ms' │ '   76.56 x' │
│     Array_String │    2000    │ '    728 ms' │ '     12 ms' │ '   60.67 x' │
│    Array_Boolean │    2000    │ '    726 ms' │ '      7 ms' │ '  103.71 x' │
│    Array_ObjectA │    2000    │ '   3631 ms' │ '     35 ms' │ '  103.74 x' │
│    Array_ObjectB │    2000    │ '   3636 ms' │ '     40 ms' │ '   90.90 x' │
│      Array_Tuple │    2000    │ '   2119 ms' │ '     31 ms' │ '   68.35 x' │
│      Array_Union │    2000    │ '   1550 ms' │ '     23 ms' │ '   67.39 x' │
│    Array_Vector4 │    2000    │ '   2200 ms' │ '     18 ms' │ '  122.22 x' │
│    Array_Matrix4 │    2000    │ '   1494 ms' │ '     14 ms' │ '  106.71 x' │
└──────────────────┴────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-validate'></a>

### Validate

This benchmark measures validation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/check.ts).

```typescript
┌──────────────────┬────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│     (index)      │ Iterations │  ValueCheck  │     Ajv      │ TypeCompiler │ Performance  │
├──────────────────┼────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│           Number │  1000000   │ '     28 ms' │ '      6 ms' │ '      6 ms' │ '    1.00 x' │
│           String │  1000000   │ '     25 ms' │ '     20 ms' │ '     11 ms' │ '    1.82 x' │
│          Boolean │  1000000   │ '     34 ms' │ '     22 ms' │ '     13 ms' │ '    1.69 x' │
│             Null │  1000000   │ '     37 ms' │ '     28 ms' │ '     10 ms' │ '    2.80 x' │
│            RegEx │  1000000   │ '    162 ms' │ '     50 ms' │ '     37 ms' │ '    1.35 x' │
│          ObjectA │  1000000   │ '    550 ms' │ '     38 ms' │ '     22 ms' │ '    1.73 x' │
│          ObjectB │  1000000   │ '   1033 ms' │ '     58 ms' │ '     38 ms' │ '    1.53 x' │
│            Tuple │  1000000   │ '    126 ms' │ '     24 ms' │ '     14 ms' │ '    1.71 x' │
│            Union │  1000000   │ '    326 ms' │ '     25 ms' │ '     16 ms' │ '    1.56 x' │
│        Recursive │  1000000   │ '   3089 ms' │ '    436 ms' │ '    101 ms' │ '    4.32 x' │
│          Vector4 │  1000000   │ '    155 ms' │ '     24 ms' │ '     12 ms' │ '    2.00 x' │
│          Matrix4 │  1000000   │ '    579 ms' │ '     41 ms' │ '     28 ms' │ '    1.46 x' │
│   Literal_String │  1000000   │ '     50 ms' │ '     21 ms' │ '     13 ms' │ '    1.62 x' │
│   Literal_Number │  1000000   │ '     46 ms' │ '     22 ms' │ '     11 ms' │ '    2.00 x' │
│  Literal_Boolean │  1000000   │ '     48 ms' │ '     20 ms' │ '     10 ms' │ '    2.00 x' │
│     Array_Number │  1000000   │ '    424 ms' │ '     32 ms' │ '     19 ms' │ '    1.68 x' │
│     Array_String │  1000000   │ '    483 ms' │ '     34 ms' │ '     28 ms' │ '    1.21 x' │
│    Array_Boolean │  1000000   │ '    432 ms' │ '     35 ms' │ '     26 ms' │ '    1.35 x' │
│    Array_ObjectA │  1000000   │ '  13895 ms' │ '   2440 ms' │ '   1495 ms' │ '    1.63 x' │
│    Array_ObjectB │  1000000   │ '  16261 ms' │ '   2633 ms' │ '   2011 ms' │ '    1.31 x' │
│      Array_Tuple │  1000000   │ '   1741 ms' │ '     98 ms' │ '     66 ms' │ '    1.48 x' │
│      Array_Union │  1000000   │ '   4825 ms' │ '    232 ms' │ '     87 ms' │ '    2.67 x' │
│  Array_Recursive │  1000000   │ '  54158 ms' │ '   6966 ms' │ '   1173 ms' │ '    5.94 x' │
│    Array_Vector4 │  1000000   │ '   2577 ms' │ '     99 ms' │ '     48 ms' │ '    2.06 x' │
│    Array_Matrix4 │  1000000   │ '  12648 ms' │ '    397 ms' │ '    249 ms' │ '    1.59 x' │
└──────────────────┴────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

<a name='benchmark-compression'></a>

### Compression

The following table lists esbuild compiled and minified sizes for each TypeBox module.

```typescript
┌──────────────────────┬────────────┬────────────┬─────────────┐
│       (index)        │  Compiled  │  Minified  │ Compression │
├──────────────────────┼────────────┼────────────┼─────────────┤
│ typebox/compiler     │ '   54 kb' │ '   27 kb' │  '1.97 x'   │
│ typebox/conditional  │ '   44 kb' │ '   17 kb' │  '2.45 x'   │
│ typebox/format       │ '    0 kb' │ '    0 kb' │  '2.66 x'   │
│ typebox/guard        │ '   22 kb' │ '   11 kb' │  '2.05 x'   │
│ typebox/value        │ '   78 kb' │ '   36 kb' │  '2.13 x'   │
│ typebox              │ '   12 kb' │ '    6 kb' │  '1.89 x'   │
└──────────────────────┴────────────┴────────────┴─────────────┘
```

<a name='contribute'></a>

## Contribute

TypeBox is open to community contribution. Please ensure you submit an open issue before submitting your pull request. The TypeBox project preferences open community discussion prior to accepting new features.
