<div align='center'>

<h1>TypeBox</h1>

<p>JSON Schema Type Builder with Static Type Resolution for TypeScript</p>
	
<img src="https://github.com/sinclairzx81/typebox/blob/master/typebox.png?raw=true" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox.svg)](https://badge.fury.io/js/%40sinclair%2Ftypebox) [![GitHub CI](https://github.com/sinclairzx81/typebox/workflows/GitHub%20CI/badge.svg)](https://github.com/sinclairzx81/typebox/actions)

</div>

<a name="Install"></a>

## Install

#### Node

```bash
$ npm install @sinclair/typebox --save
```

#### Deno

```typescript
import { Static, Type } from 'https://deno.land/x/typebox/src/typebox.ts'
```

## Example

```typescript
import { Static, Type } from '@sinclair/typebox'

const T = Type.String()     // const T = { "type": "string" }

type T = Static<typeof T>   // type T = string
```

<a name="Overview"></a>

## Overview

TypeBox is a library that creates in-memory JSON Schema objects that can be statically inferred as TypeScript types. The schemas produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox allows one to create a unified type that can be both statically asserted by the TypeScript compiler and runtime asserted using standard JSON Schema validation.

TypeBox can be used as a simple tool to build up complex schemas or integrated into RPC or REST services to help validate JSON data received over the wire. TypeBox does not provide any JSON schema validation. Please use libraries such as AJV to validate schemas built with this library.

Requires TypeScript 4.3.5 and above.

License MIT

## Contents
- [Install](#Install)
- [Overview](#Overview)
- [Usage](#Usage)
- [Types](#Types)
- [Modifiers](#Modifiers)
- [Options](#Options)
- [Extended Types](#Extended-Types)
- [Generic Types](#Generic-Types)
- [Reference Types](#Reference-Types)
- [Recursive Types](#Recursive-Types)
- [Custom Types](#Custom-Types)
- [Strict](#Strict)
- [Validation](#Validation)
- [OpenAPI](#OpenAPI)

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

const T = Type.Object({               // const T = {
    id: Type.String(),                //   type: 'object',
    name: Type.String(),              //   properties: { 
    timestamp: Type.Integer()         //      id: { 
})                                    //         type: 'string' 
                                      //      },
                                      //      name: { 
                                      //         type: 'string' 
                                      //      },
                                      //      timestamp: { 
                                      //         type: 'integer' 
                                      //      }
                                      //   }, 
                                      //   required: [
                                      //      "id",
                                      //      "name",
                                      //      "timestamp"
                                      //   ]
                                      // } 

//--------------------------------------------------------------------------------------------
//
// ... then infer back to the original static type this way.
//
//--------------------------------------------------------------------------------------------

type T = Static<typeof T>             // type T = {
                                      //    id: string,
                                      //    name: string,
                                      //    timestamp: number
                                      // }

//--------------------------------------------------------------------------------------------
//
// ... then use the type both as JSON schema and as a TypeScript type.
//
//--------------------------------------------------------------------------------------------

function receive(value: T) {         // ... as a Type

    if(JSON.validate(T, value)) {    // ... as a Schema

        // ok...
    }
}
```

<a name="Types"></a>

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
│                                │                             │    type: 'string'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Number()        │ type T = number             │ const T = {                    │
│                                │                             │    type: 'number'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Integer()       │ type T = number             │ const T = {                    │
│                                │                             │    type: 'integer'             │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Boolean()       │ type T = boolean            │ const T = {                    │
│                                │                             │    type: 'boolean'             │
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
│                                │                             │    const: 42                   │
│                                │                             │    type: 'number'              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Array(          │ type T = number[]           │ const T = {                    │
│    Type.Number()               │                             │    type: 'array',              │
│ )                              │                             │    items: {                    │
│                                │                             │      type: 'number'            │
│                                │                             │    }                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   x: Type.Number(),            │    x: number,               │   type: 'object',              │
│   y: Type.Number()             │    y: number                │   properties: {                │
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
│   Type.Number(),               │                             │    type: 'array',              │
│   Type.Number()                │                             │    items: [                    │
│ ])                             │                             │       {                        │
│                                │                             │         type: 'number'         │
│                                │                             │       }, {                     │
│                                │                             │         type: 'number'         │
│                                │                             │       }                        │
│                                │                             │    ],                          │
│                                │                             │    additionalItems: false,     │
│                                │                             │    minItems: 2,                │
│                                │                             │    maxItems: 2,                │
│                                │                             │ }                              │
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
│   Type.Object({                │   x: number,                │    enum: ['x', 'y'],           │
│     x: Type.Number(),          │   y: number                 │    type: 'string'              │
│     y: Type.Number()           │ }                           │ }                              │
│   })                           │                             │                                │
│ )                              │                             │                                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Union([         │ type T = string | number    │ const T = {                    │
│   Type.String(),               │                             │    anyOf: [{                   │
│   Type.Number()                │                             │       type: 'string'           │
│ ])                             │                             │    }, {                        │
│                                │                             │       type: 'number'           │
│                                │                             │    }]                          │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Intersect([     │ type T = {                  │ const T = {                    │
│    Type.Object({               │    x: number                │    type: 'object',             │
│       x: Type.Number()         │ } & {                       │    properties: {               │
│    }),                         │    y: number                │       x: {                     │
│    Type.Object({               │ }                           │         type: 'number'         │
│       y: Type.Number()         │                             │       },                       │
│   })                           │                             │       y: {                     │
│ ])                             │                             │         type: 'number'         │
│                                │                             │       }                        │
│                                │                             │    },                          │
│                                │                             │    required: ['x', 'y']        │
│                                │                             │  }                             │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Record(         │ type T = Record<            │ const T = {                    │
│    Type.String(),              │    string,                  │    type: 'object',             │
│    Type.Number()               │    number,                  │    patternProperties: {        │
│ )                              │ >                           │      '^.*$': {                 │
│                                │                             │         type: 'number'         │
│                                │                             │      }                         │
│                                │                             │    }                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Partial(        │ type T = Partial<{          │ const T = {                    │
│    Type.Object({               │    x: number,               │   type: 'object',              │
│         x: Type.Number(),      │    y: number                │   properties: {                │
│         y: Type.Number()       | }>                          │     x: {                       │
│    })                          │                             │        type: 'number'          │
│ )                              │                             │     },                         │
│                                │                             │     y: {                       │
│                                │                             │        type: 'number'          │
│                                │                             │     }                          │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Required(       │ type T = Required<{         │ const T = {                    │
│    Type.Object({               │    x?: number,              │   type: 'object',              │
│       x: Type.Optional(        │    y?: number               │   properties: {                │
│          Type.Number()         | }>                          │     x: {                       │
│       ),                       │                             │        type: 'number'          │
│       y: Type.Optional(        │                             │     },                         │
│          Type.Number()         │                             │     y: {                       │
│       )                        │                             │        type: 'number'          │
│    })                          │                             │     }                          │
│ )                              │                             │   },                           │
│                                │                             │   required: ['x', 'y']         │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Pick(           │ type T = Pick<{             │ const T = {                    │
│    Type.Object({               │    x: number,               │   type: 'object',              │
│       x: Type.Number(),        │    y: number                │   properties: {                │
│       y: Type.Number(),        | }, 'x'>                     │     x: {                       │
│     }), ['x']                  │                             │        type: 'number'          │
│ )                              │                             │     }                          │
│                                │                             │   },                           │
│                                │                             │   required: ['x']              │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Omit(           │ type T = Omit<{             │ const T = {                    │
│    Type.Object({               │    x: number,               │   type: 'object',              │
│       x: Type.Number(),        │    y: number                │   properties: {                │
│       y: Type.Number(),        | }, 'x'>                     │     y: {                       │
│     }), ['x']                  │                             │        type: 'number'          │
│ )                              │                             │     }                          │
│                                │                             │   },                           │
│                                │                             │   required: ['y']              │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```
<a name="Modifiers"></a>

### Modifiers

TypeBox provides modifiers that can be applied to an objects properties. This allows for `optional` and `readonly` to be applied to that property. The following table illustates how they map between TypeScript and JSON Schema.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ JSON Schema                    │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.Optional(         │    name?: string,           │   type: 'object',              │
│      Type.String(),            │ }                           │   properties: {                │
│   )                            │                             │      name: {                   │
│ })  	                         │                             │        type: 'string'          │
│                                │                             │      }                         │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.Readonly(         │    readonly name: string,   │   type: 'object',              │
│      Type.String(),            │ }                           │   properties: {                │
│   )                            │                             │      name: {                   │
│ })  	                         │                             │        type: 'string'          │
│                                │                             │      }                         │
│                                │                             │   },                           │
│                                │                             │   required: ['name']           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.ReadonlyOptional( │    readonly name?: string,  │   type: 'object',              │
│      Type.String(),            │ }                           │   properties: {                │
│   )                            │                             │      name: {                   │
│ })  	                         │                             │        type: 'string'          │
│                                │                             │      }                         │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name="Options"></a>

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

<a name="Extended-Types"></a>

### Extended Types

In addition to JSON schema types, TypeBox provides several extended types that allow for `function` and `constructor` types to be composed. These additional types are not valid JSON Schema and will not validate using typical JSON Schema validation. However, these types can be used to frame JSON schema and describe callable interfaces that may receive JSON validated data. These types are as follows.

```typescript
┌────────────────────────────────┬─────────────────────────────┬────────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ Extended Schema                │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Constructor([   │ type T = new (              │ const T = {                    │
│    Type.String(),              │  arg0: string,              │   type: 'constructor'          │
│    Type.Number(),              │  arg1: number               │   arguments: [{                │
│ ], Type.Boolean())             │ ) => boolean                │      type: 'string'            │
│                                │                             │   }, {                         │
│                                │                             │      type: 'number'            │
│                                │                             │   }],                          │
│                                │                             │   returns: {                   │
│                                │                             │      type: 'boolean'           │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Function([      │ type T = (                  │ const T = {                    │
|    Type.String(),              │  arg0: string,              │   type : 'function',           │
│    Type.Number(),              │  arg1: number               │   arguments: [{                │
│ ], Type.Boolean())             │ ) => boolean                │      type: 'string'            │
│                                │                             │   }, {                         │
│                                │                             │      type: 'number'            │
│                                │                             │   }],                          │
│                                │                             │   returns: {                   │
│                                │                             │      type: 'boolean'           │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Uint8Array()    │ type T = Uint8Array         │ const T = {                    │
│                                │                             │   type: 'Uint8Array',          │
│                                │                             │   specialized: 'Uint8Array'    │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Promise(        │ type T = Promise<string>    │ const T = {                    │
│    Type.String()               │                             │   type: 'promise',             │
│ )                              │                             │   item: {                      │
│                                │                             │      type: 'string'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Undefined()     │ type T = undefined          │ const T = {                    │
│                                │                             │   type: 'undefined'            │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Void()          │ type T = void               │ const T = {                    │
│                                │                             │   type: 'null'                 │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name="Generic-Types"></a>

### Generic Types

Generic types can be created using functions. The following creates a generic `Nullable<T>` type. 

```typescript
import { Type, Static, TSchema } from '@sinclair/typebox'

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()])

const T = Nullable(Type.String())                    // const T = {
                                                     //   "anyOf": [{
                                                     //      type: 'string'
                                                     //   }, {
                                                     //      type: 'null'
                                                     //   }]
                                                     // }

type T = Static<typeof T>                            // type T = string | null

const U = Nullable(Type.Number())                    // const U = {
                                                     //   "anyOf": [{
                                                     //      type: 'number'
                                                     //   }, {
                                                     //      type: 'null'
                                                     //   }]
                                                     // }

type U = Static<typeof U>                            // type U = number | null
```

<a name="Reference-Types"></a>

### Reference Types

Types can be referenced with `Type.Ref(...)`. To reference a type, the target type must specify an `$id`.

```typescript
const T = Type.String({ $id: 'T' })                  // const T = {
                                                     //    $id: 'T',
                                                     //    type: 'string'
                                                     // }
                                             
const R = Type.Ref(T)                                // const R = {
                                                     //    $ref: 'T'
                                                     // }
```

<a name="Recursive-Types"></a>

### Recursive Types

Recursive types can be created with the `Type.Recursive(...)` function.

```typescript
const Node = Type.Recursive(Node => Type.Object({    // const Node = {
    id:    Type.String(),                            //   $id: "Node",
    nodes: Type.Array(Node),                         //   type: "object",
}), { $id: 'Node' })                                 //   properties: {
                                                     //     id: {
                                                     //       "type": "string"
                                                     //     },
                                                     //     nodes: {
                                                     //       type: "array",
                                                     //       items: {
                                                     //         $ref: "Node"
                                                     //       }
                                                     //     }
                                                     //   },
                                                     //   required: [
                                                     //     "id",
                                                     //     "nodes"
                                                     //   ]
                                                     // }

type Node = Static<typeof Node>                      // type Node = {
                                                     //   id: string
                                                     //   nodes: ...
                                                     // }

function visit(node: Node) {
    for(const inner of node.nodes) {
        visit(inner) // inner is Node
    }
}
```
### Reference Types

Types can be referenced with `Type.Ref(...)`. To reference a type, the target type must specify an `$id`.

```typescript
const T = Type.String({ $id: 'T' })                  // const T = {
                                                     //    $id: 'T',
                                                     //    type: 'string'
                                                     // }
                                             
const R = Type.Ref(T)                                // const R = {
                                                     //    $ref: 'T'
                                                     // }
```

<a name="Custom-Types"></a>

### Custom Types

Custom types can be created using the `Type.Unsafe(...)` function. You can use this function to custom types whose schema representations which may be different to the static type representation. Consider the following.

```typescript
const T = Type.Unsafe<string>({ type: 'number' })    // const T = {
                                                     //   type: 'number'
                                                     // }

type T = Static<typeof T>                            // type T = string
```

The `Type.Unsafe(...)` function can be used with function generics to create custom schema representations for validators with specific schema representation rules. An example of which would be OpenAPI's `nullable` and `string-enum` representations. The following implements these schemas using `Type.Unsafe(...)`.

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
// StringUnion<[...]>
//
//--------------------------------------------------------------------------------------------

function StringEnum<T extends string[]>(values: [...T]) {
    return Type.Unsafe<T[number]>({ enum: values })
}

const T = StringEnum(['A', 'B', 'C'])                // const T = {
                                                     //    enum: ['A', 'B', 'C']
                                                     // }

type T = Static<typeof T>                            // type T = 'A' | 'B' | 'C'

```


<a name="Strict"></a>

### Strict

TypeBox schemas contain the `Kind` and `Modifier` symbol properties. These properties are provided to enable runtime type reflection on schemas, as well as helping TypeBox to internally compose types. These properties are not strictly valid JSON schema so in some cases it may be desirable to omit them. TypeBox provides a `Type.Strict()` function that will omit these properties if necessary.

```typescript
const T = Type.Object({                              // const T = {
    name: Type.Optional(Type.String())               //   [Kind]: 'Object',
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

<a name="Validation"></a>

### Validation

TypeBox does not provide JSON schema validation so users will need to select an appropriate JSON Schema validator for their needs. TypeBox schemas target JSON Schema draft 6 so any validator capable of draft 6 should be fine. A good library to use for validation in JavaScript environments is [AJV](https://www.npmjs.com/package/ajv). The following example shows setting up AJV 7 to work with TypeBox.

```bash
$ npm install ajv ajv-formats --save
```

```typescript
//--------------------------------------------------------------------------------------------
//
// Import the 2019 compliant validator from AJV
//
//--------------------------------------------------------------------------------------------

import { Type }   from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv        from 'ajv'

//--------------------------------------------------------------------------------------------
//
// Setup AJV validator with the following options and formats
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

const User = Type.Object({
    userId: Type.String({ format: 'uuid' }),
    email:  Type.String({ format: 'email' }),
    online: Type.Boolean(),
}, { additionalProperties: false })

//--------------------------------------------------------------------------------------------
//
// Validate Data
//
//--------------------------------------------------------------------------------------------

const ok = ajv.validate(User, { 
    userId: '68b4b1d8-0db6-468d-b551-02069a692044', 
    email:  'dave@domain.com',
    online:  true
}) // -> ok
```

Please refer to the official AJV [documentation](https://ajv.js.org/guide/getting-started.html) for additional information on using AJV.