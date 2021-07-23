<div align='center'>

<h1>TypeBox</h1>

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

## Usage

```typescript
import { Static, Type } from '@sinclair/typebox'

const T = Type.String()     // const T = { "type": "string" }

type T = Static<typeof T>   // type T = string
```

<a name="Overview"></a>

## Overview

TypeBox is a type builder library that creates in-memory JSON Schema objects that can be statically resolved to TypeScript types. The schemas produced by this library are built to match the static type checking rules of the TypeScript compiler. TypeBox allows one to create a single unified type that can be both statically checked by the TypeScript compiler and runtime asserted using standard JSON schema validation.

TypeBox can be used as a simple tool to build up complex schemas or integrated into RPC or REST services to help validate JSON data received over the wire. TypeBox does not provide any JSON schema validation. Please use libraries such as AJV to validate schemas built with this library.

Requires TypeScript 4.0.3 and above.

License MIT

## Contents
- [Install](#Install)
- [Overview](#Overview)
- [Example](#Example)
- [Types](#Types)
- [Modifiers](#Modifiers)
- [Options](#Options)
- [Reference Types](#Reference-Types)
- [Recursive Types](#Recursive-Types)
- [Extended Types](#Extended-Types)
- [Strict](#Strict)
- [Validation](#Validation)

<a name="Example"></a>

## Example

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

const T = Type.Object({             // const T = {
    id: Type.String(),              //   type: 'object',
    name: Type.String(),            //   properties: { 
    timestamp: Type.Integer()       //      id: { 
})                                  //         type: 'string' 
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

type T = Static<typeof T>           // type T = {
                                    //    id: string,
                                    //    name: string,
                                    //    timestamp: number
                                    // }

//--------------------------------------------------------------------------------------------
//
// ... then use the type both as JSON schema and as a TypeScript type.
//
//--------------------------------------------------------------------------------------------

function receive(value: T) {      // ... as a Type

    if(JSON.validate(T, value)) { // ... as a Schema

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
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Any()           │ type T = any                │ const T = { }                  │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Unknown()       │ type T = unknown            │ const T = { }                  │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.String()        │ type T = string             │ const T = {                    │
│                                │                             │    type: 'string'              │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Number()        │ type T = number             │ const T = {                    │
│                                │                             │    type: 'number'              │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Integer()       │ type T = number             │ const T = {                    │
│                                │                             │    type: 'integer'             │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Boolean()       │ type T = boolean            │ const T = {                    │
│                                │                             │    type: 'boolean'             │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Null()          │ type T = null               │ const T = {                    │
│                                │                             │    type: 'null'                │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.RegEx(/foo/)	 │ type T = string             │ const T = {                    │
│                                │                             │    type: 'string',             │
│                                │                             │    pattern: 'foo'              │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Literal(42)     │ type T = 42                 │ const T = {                    │
│                                │                             │    const: 42                   │
│                                │                             │    type: 'number'              │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Array(          │ type T = number[]           │ const T = {                    │
│    Type.Number()               │                             │    type: 'array',              │
│ )                              │                             │    items: {                    │
│                                │                             │      type: 'number'            │
│                                │                             │    }                           │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   x: Type.Number(),            │    x: number,               │   type: 'object',              │
│   y: Type.Number()             │    y: number                │   properties: {                │
│ })                             │ }                           │      x: {                      │
│                                │                             │        type: 'number'          │
│   	                         │                             │      },                        │
│   	                         │                             │      y: {                      │
│   	                         │                             │        type: 'number'          │
│                                │                             │      }                         │
│   	                         │                             │   },                           │
│   	                         │                             │   required: ['x', 'y']         │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Tuple([         │ type T = [number, number]   │ const T = {                    │
│   Type.Number(),               │                             │    type: 'array',              │
│   Type.Number()                │                             │    items: [                    │
│ ])                             │                             │       {                        │
│   	                         │                             │         type: 'number'         │
│   	                         │                             │       }, {                     │
│   	                         │                             │         type: 'number'         │
│   	                         │                             │       }                        │
│   	                         │                             │    ],                          │
│   	                         │                             │    additionalItems: false,     │
│   	                         │                             │    minItems: 2,                │
│   	                         │                             │    maxItems: 2,                │
│   	                         │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ enum Foo {                     │ enum Foo {                  │ const T = {                    │
│   A,                           │   A,                        │   anyOf: [{                    │
│   B                            │   B                         │     type: 'number',            │
│ }                              │ }                           │     const: 0                   │
│                                │                             │   }, {                         │
│ type T = Type.Enum(Foo)        │ type T = Foo                │     type: 'number',            │
│                                │                             │     const: 1                   │
│                                │                             │   }]                           │
│                                │                             │ }                              │
│                                │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Union([         │ type T = string | number    │ const T = {                    │
│   Type.String(),               │                             │    anyOf: [{                   │
│   Type.Number()                │                             │       type: 'string'           │
│ ])                             │                             │    }, {                        │
│                                │                             │       type: 'number'           │
│                                │                             │    }]                          │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.KeyOf(          │ type T = keyof {            │ const T = {                    │
│   Type.Object({                │   x: number,                │    enum: ['x', 'y'],           │
│     x: Type.Number(),          │   y: number                 │    type: 'string'              │
│     y: Type.Number()           │ }                           │ }                              │
│   })                           │                             │                                │
│ )                              │                             │                                │
│   	                         │                             │                                │
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
│   	                         │                             │            type: 'number'      │
│   	                         │                             │          }                     │
│   	                         │                             │       },                       │
│   	                         │                             │       required: ['b']          │
│   	                         │                             │    }]                          │
│   	                         │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Record(         │ type T = {                  │ const T = {                    │
│    Type.String(),              │    [key: string]: number    │    type: 'object',             │
│    Type.Number()               │ }                           │    patternProperties: {        │
│ ) 	                         │                             │      '.*': {                   │
│   	                         │                             │         type: 'number'         │
│   	                         │                             │      }                         │
│   	                         │                             │    }                           │
│   	                         │                             │ }                              │
│   	                         │                             │                                │
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
│   	                         │                             │                                │
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
│ )                              │                             │   }                            │
│                                │                             │   required: ['x', 'y']         │
│                                │                             │ }                              │
│   	                         │                             │                                │
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
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.Optional(         │    name?: string,           │   type: 'object',              │
│      Type.String(),            │ }                           │   properties: {                │
│   )	                         │                             │      name: {                   │
│ })  	                         │                             │        type: 'string'          │
│   	                         │                             │      }                         │
│   	                         │                             │   }                            │
│   	                         │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.Readonly(         │    readonly name: string,   │   type: 'object',              │
│      Type.String(),            │ }                           │   properties: {                │
│   )	                         │                             │      name: {                   │
│ })  	                         │                             │        type: 'string'          │
│   	                         │                             │      }                         │
│   	                         │                             │   },                           │
│                                │                             │   required: ['name']           │
│   	                         │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                    │
│   name: Type.ReadonlyOptional( │    readonly name?: string,  │   type: 'object',              │
│      Type.String(),            │ }                           │   properties: {                │
│   )	                         │                             │      name: {                   │
│ })  	                         │                             │        type: 'string'          │
│   	                         │                             │      }                         │
│   	                         │                             │   }                            │
│                                │                             │ }                              │
│   	                         │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name="Options"></a>

### Options

You can pass additional JSON schema properties on the last argument of any given type. The following are some examples.

```typescript
// string must be an email
const T = Type.String({ format: 'email' })

// number must be a multiple of 2
const T = Type.Number({ multipleOf: 2 })

// array must have at least 5 integer values
const T = Type.Array(Type.Integer(), { minItems: 5 })
```

<a name="Reference-Types"></a>

### Reference Types

Type referencing can be useful to reduce schema duplication when composing large schemas. TypeBox allows for type referencing with the `Type.Box(...)` and `Type.Ref(...)` functions. The `Type.Box(...)` function is used to create a container for set of common related types and the `Type.Ref(...)` function allows for referencing into the container. The following shows a set of common math types contained within a box, and a vertex structure that references those types.

```typescript
const Math3D = Type.Box('math3d', {           //  const Math3D = {
  Vector4: Type.Object({                      //    $id: 'math3d',
    x: Type.Number(),                         //    definitions: {
    y: Type.Number(),                         //      Vector4: {
    z: Type.Number(),                         //        type: 'object',
    w: Type.Number()                          //        properties: {
  }),                                         //          x: { type: 'number' },
  Vector3: Type.Object({                      //          y: { type: 'number' },
    x: Type.Number(),                         //          z: { type: 'number' },
    y: Type.Number(),                         //          w: { type: 'number' }
    z: Type.Number()                          //        },
  }),                                         //        required: ['x', 'y', 'z', 'w']
  Vector2: Type.Object({                      //      },
    x: Type.Number(),                         //      Vector3: {
    y: Type.Number()                          //        type: 'object',
  })                                          //        properties: {
})                                            //          x: { 'type': 'number' },
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
													 
const Vertex = Type.Object({                  //  const Vertex = {
    position: Type.Ref(Math3D, 'Vector4'),    //    type: 'object',
    normal:   Type.Ref(Math3D, 'Vector3'),    //    properties: {
    uv:       Type.Ref(Math3D, 'Vector2')     //      position: { $ref: 'math3d#/definitions/Vector4' },
})                                            //      normal: { $ref: 'math3d#/definitions/Vector3' },
                                              //      uv: { $ref: 'math3d#/definitions/Vector2' }
                                              //    },
                                              //    required: ['position', 'normal', 'uv']
                                              //  }
```

<a name="Recursive-Types"></a>

### Recursive Types

TypeBox provides support for recursive types. This is handled via the `Type.Rec(...)` function. The following creates a `Node` type that contains an array of inner `nodes`. Please note that due to current recursion limits on TypeScript inference, it's currently not possible for TypeBox to statically infer for recursive types. Instead TypeBox will resolve inner recursive types as `any`.

```typescript
const Node = Type.Rec('Node', Self =>         // const Node = {
  Type.Object({                               //   $id: 'Node',
     id:    Type.String(),                    //   $ref: 'Node#/definitions/self',
     nodes: Type.Array(Self),                 //   definitions: {
  })                                          //     self: {
)                                             //       type: 'object',
                                              //       properties: {
                                              //         id: {
                                              //           type: 'string'
                                              //         },
                                              //         nodes: {
                                              //            type: 'array',
                                              //            items: {
                                              //              $ref: 'Node#/definitions/self'
                                              //            }
                                              //         }
                                              //      }
                                              //    }
                                              // }

type Node = Static<typeof Node>               // type Node = {
                                              //   id: string
                                              //   nodes: any[]
                                              //

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
│   	                         │                             │                                │
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
│   	                         │                             │                                │
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
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Promise(        │ type T = Promise<string>    │ const T = {                    │
│    Type.String()               │                             │   type: 'promise',             │
│ )                              │                             │   item: {                      │
│                                │                             │      type: 'string'            │
│                                │                             │   }                            │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Undefined()     │ type T = undefined          │ const T = {                    │
│                                │                             │   type: 'undefined'            │
│                                │                             │ }                              │
│   	                         │                             │                                │
├────────────────────────────────┼─────────────────────────────┼────────────────────────────────┤
│ const T = Type.Void()          │ type T = void               │ const T = {                    │
│                                │                             │   type: 'void'                 │
│                                │                             │ }                              │
│   	                         │                             │                                │
└────────────────────────────────┴─────────────────────────────┴────────────────────────────────┘
```

<a name="Strict"></a>

### Strict

TypeBox includes the properties `kind` and `modifier` on each underlying schema. These properties are used to help TypeBox statically resolve the schemas to the appropriate TypeScript type as well as apply the appropriate modifiers to an objects properties (such as optional). These properties are not strictly valid JSON schema so in some cases it may be desirable to omit them. TypeBox provides a `Type.Strict()` function that will omit these properties if nessasary.

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

TypeBox does not provide JSON schema validation out of the box and expects users to select an appropriate JSON schema validation library for their needs. TypeBox schemas should match JSON Schema draft `2019-09` so any library capable of draft `2019-09` should be fine. A good library to use for validation is [Ajv](https://www.npmjs.com/package/ajv). The following example shows setting up Ajv 7 to work with TypeBox.

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
// Setup validator with the following options and formats
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
    id:     Type.String({ format: 'uuid' }),
    email:  Type.String({ format: 'email' }),
    online: Type.Boolean(),
}, { additionalProperties: false })

//--------------------------------------------------------------------------------------------
//
// Validate Data
//
//--------------------------------------------------------------------------------------------

const ok = ajv.validate(User, { 
    id:    '68b4b1d8-0db6-468d-b551-02069a692044', 
    email: 'dave@domain.com',
    online: true
}) // -> ok
```

