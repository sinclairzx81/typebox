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
- [Modifiers](#modifiers)
- [Options](#options)
- [Extended Types](#extended-types)
- [Reference Types](#reference-types)
- [Recursive Types](#recursive-types)
- [Generic Types](#generic-types)
- [Unsafe Types](#unsafe-types)
- [Conditional Types](#conditional-types)
- [Values](#values)
- [Guards](#guards)
- [Strict](#strict)
- [Validation](#validation)
- [Compiler](#compiler)
- [Formats](#formats)
- [Benchmark](#benchmark)
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

## Types

The following table outlines the TypeBox mappings between TypeScript and JSON schema.

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

## Modifiers

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

## Options

You can pass additional JSON schema options on the last argument of any given type. The following are some examples.

```typescript
// string must be an email
const T = Type.String({ format: 'email' })

// number must be a multiple of 2
const T = Type.Number({ multipleOf: 2 })

// array must have at least 5 integer values
const T = Type.Array(Type.Integer(), { minItems: 5 })


```

## Extended Types

In addition to JSON schema types, TypeBox provides several extended types that allow for `function` and `constructor` types to be composed. These additional types are not valid JSON Schema and will not validate using typical JSON Schema validation. However, these types can be used to frame JSON schema and describe callable interfaces that may receive JSON validated data. These types are as follows.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ Extended Schema                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Constructor([   │ type T = new (              │ const T = {                    │
│   Type.String(),               │  arg0: string,              │   type: 'constructor'          │
│   Type.Number()                │  arg1: number               │   parameters: [{               │
│ ], Type.Boolean())             │ ) => boolean                │     type: 'string'             │
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
|   Type.String(),               │  arg0: string,              │   type : 'function',           │
│   Type.Number()                │  arg1: number               │   parameters: [{               │
│ ], Type.Boolean())             │ ) => boolean                │     type: 'string'             │
│                                │                             │   }, {                         │
│                                │                             │     type: 'number'             │
│                                │                             │   }],                          │
│                                │                             │   return: {                    │
│                                │                             │     type: 'boolean'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uint8Array()    │ type T = Uint8Array         │ const T = {                    │
│                                │                             │   type: 'object',              │
│                                │                             │   specialized: 'Uint8Array'    │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Promise(        │ type T = Promise<string>    │ const T = {                    │
│   Type.String()                │                             │   type: 'promise',             │
│ )                              │                             │   item: {                      │
│                                │                             │     type: 'string'             │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Undefined()     │ type T = undefined          │ const T = {                    │
│                                │                             │   type: 'object',              │
│                                │                             │   specialized: 'Undefined'     │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Void()          │ type T = void               │ const T = {                    │
│                                │                             │   type: 'null'                 │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘


```

## Reference Types

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

## Recursive Types

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

## Generic Types

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

## Unsafe Types

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

## Conditional Types

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

## Values

Use the value module to perform common type operations on values. This module provides functionality to create, check and cast values into a given type. Note that this module internally uses dynamic type checking to perform these operations. For faster type checking performance, consider using either Ajv or the TypeBox [TypeCompiler](#compiler).

 The value module is provided as an optional import.

```typescript
import { Value } from '@sinclair/typebox/value'
```
The following demonstrates its use.
```typescript


const T = Type.Object({ x: Type.Number(), y: Type.Number() }, { additionalProperties: false })

//--------------------------------------------------------------------------------------------
//
// Use Value.Create(T) to create a value from T.
//
//--------------------------------------------------------------------------------------------

const V = Value.Create(T)                            // const V = { x: 0, y: 0 }

//--------------------------------------------------------------------------------------------
//
// Use Value.Check(T, ...) to check if a value is of type T.
//
//--------------------------------------------------------------------------------------------

const R = Value.Check(T, { x: 1 })                   // const R = false

//--------------------------------------------------------------------------------------------
//
// Use Value.Cast(T, ...) to immutably cast a value into T.
//
//--------------------------------------------------------------------------------------------

const A = Value.Cast(T, null)                        // const A = { x: 0, y: 0 }

const B = Value.Cast(T, { x: 1 })                    // const B = { x: 1, y: 0 }

const C = Value.Cast(T, { x: 1, y: 2, z: 3 })        // const C = { x: 1, y: 2 }


```

## Guards

Use the guard module to test if values are TypeBox types.

```typescript
import { TypeGuard } from '@sinclair/typebox/guard'

const T = Type.String()

if(TypeGuard.TString(T)) {
    
  // T is TString
}


```

## Strict

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

## Validation

TypeBox schemas target JSON Schema draft 6 so any validator capable of draft 6 should be fine. A good library to use for validation in JavaScript environments is [Ajv](https://www.npmjs.com/package/ajv). The following example shows setting up Ajv to work with TypeBox.

```bash
$ npm install ajv ajv-formats --save
```

```typescript
//--------------------------------------------------------------------------------------------
//
// Import TypeBox and Ajv
//
//--------------------------------------------------------------------------------------------

import { Type }   from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv        from 'ajv'

//--------------------------------------------------------------------------------------------
//
// Setup Ajv validator with the following options and formats
//
//--------------------------------------------------------------------------------------------

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

//--------------------------------------------------------------------------------------------
//
// Create a TypeBox type
//
//--------------------------------------------------------------------------------------------

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

//--------------------------------------------------------------------------------------------
//
// Validate Data
//
//--------------------------------------------------------------------------------------------

const R = ajv.validate(T, { x: 1, y: 2, z: 3 })      // const R = true


```

Please refer to the official Ajv [documentation](https://ajv.js.org/guide/getting-started.html) for additional information on using Ajv.

## Compiler

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

## Formats

Use the `Format` module to create custom string formats. Formats provide greater flexibility over [string patterns](https://json-schema.org/understanding-json-schema/reference/regular_expressions.html), but may come at a cost of schema portability. Formats are internally shared between the TypeCompiler and Value modules. TypeBox does not provide any built in formats by default.

The format module is an optional import.

```typescript
import { Format } from '@sinclair/typebox/format'
```

The following creates a custom format to validate Mongo `ObjectId` strings

```typescript
//--------------------------------------------------------------------------------------------
//
// Format.Set(...) to create the format
//
//--------------------------------------------------------------------------------------------

Format.Set('ObjectId', value => /^[0-9a-fA-F]{24}$/.test(value))

//--------------------------------------------------------------------------------------------
//
// The format can now be used by TypeCompiler and Value modules
//
//--------------------------------------------------------------------------------------------

const T = Type.String({ format: 'ObjectId' })

const V = '507f1f77bcf86cd799439011'

const R1 = TypeCompiler.Compile(T).Check(V)          // R1 = true

const R2 = Value.Check(T, V)                         // R2 = true


```

## Benchmark

This project maintains a set of benchmarks that measure Ajv, Value and TypeCompiler compilation and validation performance. These benchmarks can be run locally by cloning this repository and running `npm run benchmark`. The results below show for Ajv version 8.11.0. 

For additional comparative benchmarks, please refer to [typescript-runtime-type-benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/).

### Compile

This benchmark measures compilation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/compile.ts).

```typescript
┌──────────────────┬────────────┬──────────────┬──────────────┬──────────────┐
│     (index)      │ Iterations │     Ajv      │ TypeCompiler │ Performance  │
├──────────────────┼────────────┼──────────────┼──────────────┼──────────────┤
│           Number │    2000    │ '    402 ms' │ '      8 ms' │ '   50.25 x' │
│           String │    2000    │ '    316 ms' │ '      8 ms' │ '   39.50 x' │
│          Boolean │    2000    │ '    308 ms' │ '      6 ms' │ '   51.33 x' │
│             Null │    2000    │ '    259 ms' │ '      5 ms' │ '   51.80 x' │
│            RegEx │    2000    │ '    479 ms' │ '     11 ms' │ '   43.55 x' │
│          ObjectA │    2000    │ '   2766 ms' │ '     41 ms' │ '   67.46 x' │
│          ObjectB │    2000    │ '   3062 ms' │ '     29 ms' │ '  105.59 x' │
│            Tuple │    2000    │ '   1258 ms' │ '     21 ms' │ '   59.90 x' │
│            Union │    2000    │ '   1449 ms' │ '     29 ms' │ '   49.97 x' │
│          Vector4 │    2000    │ '   1616 ms' │ '     16 ms' │ '  101.00 x' │
│          Matrix4 │    2000    │ '    975 ms' │ '      8 ms' │ '  121.88 x' │
│   Literal_String │    2000    │ '    350 ms' │ '      6 ms' │ '   58.33 x' │
│   Literal_Number │    2000    │ '    386 ms' │ '      5 ms' │ '   77.20 x' │
│  Literal_Boolean │    2000    │ '    377 ms' │ '      4 ms' │ '   94.25 x' │
│     Array_Number │    2000    │ '    737 ms' │ '      7 ms' │ '  105.29 x' │
│     Array_String │    2000    │ '    765 ms' │ '      7 ms' │ '  109.29 x' │
│    Array_Boolean │    2000    │ '    783 ms' │ '      8 ms' │ '   97.88 x' │
│    Array_ObjectA │    2000    │ '   3578 ms' │ '     31 ms' │ '  115.42 x' │
│    Array_ObjectB │    2000    │ '   3718 ms' │ '     33 ms' │ '  112.67 x' │
│      Array_Tuple │    2000    │ '   2259 ms' │ '     14 ms' │ '  161.36 x' │
│      Array_Union │    2000    │ '   1704 ms' │ '     20 ms' │ '   85.20 x' │
│    Array_Vector4 │    2000    │ '   2293 ms' │ '     17 ms' │ '  134.88 x' │
│    Array_Matrix4 │    2000    │ '   1575 ms' │ '     12 ms' │ '  131.25 x' │
└──────────────────┴────────────┴──────────────┴──────────────┴──────────────┘
```

### Validate

This benchmark measures validation performance for varying types. You can review this benchmark [here](https://github.com/sinclairzx81/typebox/blob/master/benchmark/measurement/module/check.ts).

```typescript
┌──────────────────┬────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│     (index)      │ Iterations │  ValueCheck  │     Ajv      │ TypeCompiler │ Performance  │
├──────────────────┼────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│           Number │  1000000   │ '     38 ms' │ '      6 ms' │ '      5 ms' │ '    1.20 x' │
│           String │  1000000   │ '     26 ms' │ '     23 ms' │ '     12 ms' │ '    1.92 x' │
│          Boolean │  1000000   │ '     26 ms' │ '     23 ms' │ '     11 ms' │ '    2.09 x' │
│             Null │  1000000   │ '     29 ms' │ '     24 ms' │ '     12 ms' │ '    2.00 x' │
│            RegEx │  1000000   │ '    169 ms' │ '     47 ms' │ '     37 ms' │ '    1.27 x' │
│          ObjectA │  1000000   │ '    551 ms' │ '     45 ms' │ '     23 ms' │ '    1.96 x' │
│          ObjectB │  1000000   │ '    995 ms' │ '     49 ms' │ '     39 ms' │ '    1.26 x' │
│            Tuple │  1000000   │ '    115 ms' │ '     30 ms' │ '     14 ms' │ '    2.14 x' │
│            Union │  1000000   │ '    294 ms' │ '     30 ms' │ '     14 ms' │ '    2.14 x' │
│        Recursive │  1000000   │ '   3308 ms' │ '    429 ms' │ '    174 ms' │ '    2.47 x' │
│          Vector4 │  1000000   │ '    145 ms' │ '     25 ms' │ '     13 ms' │ '    1.92 x' │
│          Matrix4 │  1000000   │ '    663 ms' │ '     42 ms' │ '     34 ms' │ '    1.24 x' │
│   Literal_String │  1000000   │ '     46 ms' │ '     21 ms' │ '     11 ms' │ '    1.91 x' │
│   Literal_Number │  1000000   │ '     50 ms' │ '     26 ms' │ '     11 ms' │ '    2.36 x' │
│  Literal_Boolean │  1000000   │ '     45 ms' │ '     24 ms' │ '     11 ms' │ '    2.18 x' │
│     Array_Number │  1000000   │ '    411 ms' │ '     35 ms' │ '     19 ms' │ '    1.84 x' │
│     Array_String │  1000000   │ '    438 ms' │ '     33 ms' │ '     20 ms' │ '    1.65 x' │
│    Array_Boolean │  1000000   │ '    444 ms' │ '     38 ms' │ '     24 ms' │ '    1.58 x' │
│    Array_ObjectA │  1000000   │ '  13714 ms' │ '   2819 ms' │ '   1791 ms' │ '    1.57 x' │
│    Array_ObjectB │  1000000   │ '  15855 ms' │ '   2965 ms' │ '   2066 ms' │ '    1.44 x' │
│      Array_Tuple │  1000000   │ '   1682 ms' │ '     94 ms' │ '     71 ms' │ '    1.32 x' │
│      Array_Union │  1000000   │ '   4575 ms' │ '    239 ms' │ '     86 ms' │ '    2.78 x' │
│  Array_Recursive │  1000000   │ '  51970 ms' │ '   7192 ms' │ '   2617 ms' │ '    2.75 x' │
│    Array_Vector4 │  1000000   │ '   2097 ms' │ '    100 ms' │ '     54 ms' │ '    1.85 x' │
│    Array_Matrix4 │  1000000   │ '  11596 ms' │ '    381 ms' │ '    327 ms' │ '    1.17 x' │
└──────────────────┴────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### Compression

The following table lists esbuild compiled and minified sizes for each TypeBox module.

```typescript
┌──────────────────────┬────────────┬────────────┬─────────────┐
│       (index)        │  Compiled  │  Minified  │ Compression │
├──────────────────────┼────────────┼────────────┼─────────────┤
│ typebox/compiler     │ '   48 kb' │ '   24 kb' │  '2.00 x'   │
│ typebox/conditional  │ '   41 kb' │ '   16 kb' │  '2.47 x'   │
│ typebox/format       │ '    0 kb' │ '    0 kb' │  '2.68 x'   │
│ typebox/guard        │ '   20 kb' │ '    9 kb' │  '2.08 x'   │
│ typebox/value        │ '   55 kb' │ '   25 kb' │  '2.15 x'   │
│ typebox              │ '   11 kb' │ '    5 kb' │  '1.91 x'   │
└──────────────────────┴────────────┴────────────┴─────────────┘
```

## Contribute

TypeBox is open to community contribution. Please ensure you submit an open issue before submitting your pull request. The TypeBox project preferences open community discussion prior to accepting new features.
