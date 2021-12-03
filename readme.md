<div align='center'>

<h1>TypeBox</h1>

<img src="https://github.com/sinclairzx81/typebox/blob/master/typebox.png?raw=true" />

<p>JSON Schema Type Builder with Static Type Resolution for TypeScript</p>



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

TypeBox is a library that creates in-memory JSON Schema objects that can be statically inferred as TypeScript types. The schemas produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox allows one to create a unified type that can be both statically asserted by the TypeScript compiler and runtime asserted using industry standard JSON Schema validation.

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
- [Generic Types](#Generic-Types)
- [Reference Types](#Reference-Types)
- [Recursive Types](#Recursive-Types)
- [Extended Types](#Extended-Types)
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
│    Type.Object({               │    x: number                │    allOf: [{                   │
│       x: Type.Number()         │ } & {                       │       type: 'object',          │
│    }),                         │    y: number                │       properties: {            │
│    Type.Object({               │ }                           │          a: {                  │
│       y: Type.Number()         │                             │            type: 'number'      │
│   })                           │                             │          }                     │
│ })                             │                             │       },                       │
│                                │                             │       required: ['a']          │
│                                │                             │    }, {                        │
│                                │                             │       type: 'object',          │
│                                │                             │       properties: {            │
│                                │                             │          b: {                  │
│                                │                             │            type: 'number'      │
│                                │                             │          }                     │
│                                │                             │       },                       │
│                                │                             │       required: ['b']          │
│                                │                             │    }]                          │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Record(         │ type T = {                  │ const T = {                    │
│    Type.String(),              │    [key: string]: number    │    type: 'object',             │
│    Type.Number()               │ }                           │    patternProperties: {        │
│ )                              │                             │      '^.*$': {                 │
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
<a name="Generic-Types"></a>

### Generic Types

Generic types can be created using functions. The following creates a generic `Nullable<T>` type. 

```typescript
import { Type, Static, TSchema } from '@sinclair/typebox'

// type Nullable<T> = T | null

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()])

const T = Nullable(Type.String())              // const T = {
                                               //   "anyOf": [{
                                               //      type: 'string'
                                               //   }, {
                                               //      type: 'null'
                                               //   }]
                                               // }

type T = Static<typeof T>                      // type T = string | null

const U = Nullable(Type.Number())              // const U = {
                                               //   "anyOf": [{
                                               //      type: 'number'
                                               //   }, {
                                               //      type: 'null'
                                               //   }]
                                               // }

type U = Static<typeof U>                      // type U = number | null
```

<a name="Reference-Types"></a>

### Reference Types

Types can be referenced with `Type.Ref(...)`. To reference a type, the target type must specify an `$id`.

```typescript
const T = Type.String({ $id: 'T' })            // const T = {
                                               //    $id: 'T',
                                               //    type: 'string'
                                               // }
                                             
const R = Type.Ref(T)                          // const R = {
                                               //    $ref: 'T'
                                               // }
```

It can sometimes be helpful to organize shared referenced types under a common namespace. The `Type.Namespace(...)` function can be used to create a shared definition container for related types. The following creates a `Math3D` container and a `Vertex` structure that references types in the container.

```typescript
const Math3D = Type.Namespace({                 //  const Math3D = {
  Vector4: Type.Object({                        //    $id: 'Math3D',
    x: Type.Number(),                           //    $defs: {
    y: Type.Number(),                           //      Vector4: {
    z: Type.Number(),                           //        type: 'object',
    w: Type.Number()                            //        properties: {
  }),                                           //          x: { type: 'number' },
  Vector3: Type.Object({                        //          y: { type: 'number' },
    x: Type.Number(),                           //          z: { type: 'number' },
    y: Type.Number(),                           //          w: { type: 'number' }
    z: Type.Number()                            //        },
  }),                                           //        required: ['x', 'y', 'z', 'w']
  Vector2: Type.Object({                        //      },
    x: Type.Number(),                           //      Vector3: {
    y: Type.Number()                            //        type: 'object',
  })                                            //        properties: {
}, { $id: 'Math3D' })                           //          x: { 'type': 'number' },
                                                //          y: { 'type': 'number' },
                                                //          z: { 'type': 'number' }
                                                //        },
                                                //        required: ['x', 'y', 'z']
                                                //      },
                                                //      Vector2: {
                                                //        type: 'object',
                                                //        properties: {
                                                //          x: { 'type': 'number' },
                                                //          y: { 'type': 'number' },
                                                //        },
                                                //        required: ['x', 'y']
                                                //      }
                                                //    }
                                                //  }
													 
const Vertex = Type.Object({                    //  const Vertex = {
    position: Type.Ref(Math3D, 'Vector4'),      //    type: 'object',
    normal:   Type.Ref(Math3D, 'Vector3'),      //    properties: {
    uv:       Type.Ref(Math3D, 'Vector2')       //      position: { $ref: 'Math3D#/$defs/Vector4' },
})                                              //      normal: { $ref: 'Math3D#/$defs/Vector3' },
                                                //      uv: { $ref: 'Math3D#/$defs/Vector2' }
                                                //    },
                                                //    required: ['position', 'normal', 'uv']
                                                //  }
```

<a name="Recursive-Types"></a>

### Recursive Types

Recursive types can be created with the `Type.Rec(...)` function. The following creates a `Node` type that contains an array of inner Nodes. Note that due to current restrictions on TypeScript inference, it is not possible for TypeBox to statically infer for recursive types. TypeBox will infer the inner recursive type as `any`.

```typescript
const Node = Type.Rec(Self => Type.Object({    // const Node = {
  id:    Type.String(),                        //   $id: 'Node',
  nodes: Type.Array(Self),                     //   $ref: 'Node#/$defs/self',
}), { $id: 'Node' })                           //   $defs: {
                                               //     self: {
                                               //       type: 'object',
                                               //       properties: {
                                               //         id: {
                                               //           type: 'string'
                                               //         },
                                               //         nodes: {
                                               //            type: 'array',
                                               //            items: {
                                               //              $ref: 'Node#/$defs/self'
                                               //            }
                                               //         }
                                               //      }
                                               //    }
                                               // }

type Node = Static<typeof Node>                // type Node = {
                                               //   id: string
                                               //   nodes: any[]
                                               // }

function visit(node: Node) {
    for(const inner of node.nodes) {
        visit(inner as Node)                   // Assert inner as Node
    }
}
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
│                                │                             │   type: 'void'                 │
│                                │                             │ }                              │
│                                │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name="Strict"></a>

### Strict

TypeBox schemas contain the properties `kind` and `modifier`. These properties are provided to enable runtime type reflection on schemas, as well as helping TypeBox apply the appropriate static type inference rules. These properties are not strictly valid JSON schema so in some cases it may be desirable to omit them. TypeBox provides a `Type.Strict()` function that will omit these properties if nessasary.

```typescript
const T = Type.Object({                       // const T = {
    name: Type.Optional(Type.String())        //   kind: Symbol(ObjectKind),
})                                            //   type: 'object',
                                              //   properties: {
                                              //     name: {
                                              //       kind: Symbol(StringKind),
                                              //       type: 'string',
                                              //       modifier: Symbol(OptionalModifier)
                                              //     }
                                              //   }
                                              // }

const U = Type.Strict(T)                      // const U = {
                                              //     type: 'object', 
                                              //     properties: { 
                                              //         name: { 
                                              //             type: 'string' 
                                              //         } 
                                              //     } 
                                              // }
```

<a name="Validation"></a>

### Validation

TypeBox does not provide JSON schema validation so users will need to select an appropriate JSON Schema validator for their needs. TypeBox schemas target JSON Schema draft `2019-09` so any validator capable of draft `2019-09` should be fine. A good library to use for validation in JavaScript environments is [AJV](https://www.npmjs.com/package/ajv). The following example shows setting up AJV 7 to work with TypeBox.

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
import Ajv        from 'ajv/dist/2019'

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
]).addKeyword('kind')
  .addKeyword('modifier')

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

### OpenAPI

TypeBox can be used to create schemas for OpenAPI, however users should be aware of the various disparities between the JSON Schema and OpenAPI schema specifications. Two common instances where OpenAPI diverges from the JSON Schema specification is OpenAPI's handling of string enums and nullable schemas. The following shows how you can use TypeBox to construct these types.

```typescript
import { Type, Static, TNull, TLiteral, TUnion, TSchema } from '@sinclair/typebox'

//--------------------------------------------------------------------------------------------
//
// Nullable<T>
//
//--------------------------------------------------------------------------------------------

function Nullable<T extends TSchema>(schema: T): TUnion<[T, TNull]> {
    return { ...schema, nullable: true } as any
}

const T = Nullable(Type.String())              // const T = {
                                               //   type: 'string',
                                               //   nullable: true
                                               // }

type T = Static<typeof T>                      // type T = string | null

//--------------------------------------------------------------------------------------------
//
// StringUnion<[...]>
//
//--------------------------------------------------------------------------------------------

type IntoStringUnion<T> = {[K in keyof T]: T[K] extends string ? TLiteral<T[K]>: never }

function StringUnion<T extends string[]>(values: [...T]): TUnion<IntoStringUnion<T>> {
    return { enum: values } as any
}

const T = StringUnion(['A', 'B', 'C'])          // const T = {
                                                //    enum: ['A', 'B', 'C']
                                                // }

type T = Static<typeof T>                       // type T = 'A' | 'B' | 'C'
```
