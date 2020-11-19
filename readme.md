<div align='center'>

<h1>TypeBox</h1>

<p>JSON Schema Type Builder with Static Type Resolution for TypeScript</p>

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox.svg)](https://badge.fury.io/js/%40sinclair%2Ftypebox) [![GitHub CI](https://github.com/sinclairzx81/typebox/workflows/GitHub%20CI/badge.svg)](https://github.com/sinclairzx81/typebox/actions)

</div>

## Example

```typescript
import { Static, Type } from '@sinclair/typebox'

const T = Type.String() /* const T = { "type": "string" } */

type T = Static<typeof T> /* type T = string */
```

<a name="Install"></a>

## Install

```bash
$ npm install @sinclair/typebox --save
```

<a name="Overview"></a>

## Overview

TypeBox is a type builder library that creates in-memory JSON Schema objects that can be statically resolved to TypeScript types. The schemas produced by this library are built to match the static type checking rules of the TypeScript compiler. TypeBox allows one to create a single unified type that can be both statically checked by the TypeScript compiler and runtime asserted using standard JSON schema validation.

TypeBox can be used as a simple tool to build up complex schemas or integrated into RPC or REST services to help validate JSON data received over the wire. TypeBox does not provide any JSON schema validation. Please use libraries such as [AJV](https://www.npmjs.com/package/ajv) to validate schemas built with this library.

Requires TypeScript 4.0.3 and above.

License MIT

## Contents
- [Install](#Install)
- [Overview](#Overview)
- [Example](#Example)
- [Types](#Types)
- [Modifiers](#Modifiers)
- [Options](#Options)
- [Functions](#Functions)
- [Interfaces](#Interfaces)
- [Validation](#Validation)

<a name="Example"></a>

## Example

The following demonstrates TypeBox's general usage.

```typescript

import { Type, Static } from '@sinclair/typebox'

//--------------------------------------------------------------------------------------------
//
// Let's say you have the following type ...
//
//--------------------------------------------------------------------------------------------

type Record = {
    id: string,
    name: string,
    timestamp: number
}

//--------------------------------------------------------------------------------------------
//
// ...you can express this type in the following way.
//
//--------------------------------------------------------------------------------------------

const Record = Type.Object({        // const Record = {
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
// ...then infer back to the original static type this way.
//
//--------------------------------------------------------------------------------------------

type Record = Static<typeof Record> // type Record = {
                                    //    id: string,
                                    //    name: string,
                                    //    timestamp: number
                                    // }

//--------------------------------------------------------------------------------------------
//
// ...then use the type both as JSON schema and as a TypeScript type.
//
//--------------------------------------------------------------------------------------------

function receive(record: Record) { // ...as a type
    if(JSON.validate(Record, {     // ...as a schema
        id: '42', 
        name: 'dave', 
        timestamp: Date.now() 
    })) {
        // ok...
    }
}

```

<a name="Types"></a>

## Types

The following table outlines the TypeBox mappings between TypeScript and JSON schema.

```typescript
┌────────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ JSON Schema                 │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Any()           │ type T = any                │ const T = { }               │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Unknown()       │ type T = unknown            │ const T = { }               │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.String()        │ type T = string             │ const T = {                 │
│                                │                             │    type: 'string'           │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Number()        │ type T = number             │ const T = {                 │
│                                │                             │    type: 'number'           │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Integer()       │ type T = number             │ const T = {                 │
│                                │                             │    type: 'integer'          │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Boolean()       │ type T = boolean            │ const T = {                 │
│                                │                             │    type: 'boolean'          │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Null()          │ type T = null               │ const T = {                 │
│                                │                             │    type: 'null'             │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.RegEx(/foo/)	 │ type T = string             │ const T = {                 │
│                                │                             │    type: 'string',          │
│                                │                             │    pattern: 'foo'           │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Literal('foo')  │ type T = 'foo'              │ const T = {                 │
│                                │                             │    type: 'string',          │
│                                │                             │    enum: ['foo']            │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Array(          │ type T = number[]           │ const T = {                 │
│    Type.Number()               │                             │    type: 'array',           │
│ )                              │                             │    items: {                 │
│                                │                             │      type: 'number'         │
│                                │                             │    }                        │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Dict(           │ type T = {                  │ const T = {                 │
│    Type.Number()               │      [key: string]          │    type: 'object'           │
│ )                              │ } : number                  │    additionalProperties: {  │
│   	                         │                             │      type: 'number'         │
│   	                         │                             │    }                        │
│   	                         │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                 │
│   name:  Type.String(),        │    name: string,            │   type: 'object',           │
│   email: Type.String(),        │    email: string            │   properties: {             │
│ })	                         │ }                           │      name: {                │
│   	                         │                             │        type: 'string'       │
│   	                         │                             │      },                     │
│   	                         │                             │      email: {               │
│                                │                             │        type: 'string'       │
│   	                         │                             │      }                      │
│   	                         │                             │   },                        │
│                                │                             │   required: [               │
│                                │                             │      'name',                │
│                                │                             │      'email'                │
│                                │                             │   ]                         |
│   	                         │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Tuple([         │ type T = [string, number]   │ const T = {                 │
│   Type.String(),               │                             │    type: 'array',           │
│   Type.Number()                │                             │    items: [                 │
│ ])                             │                             │       {                     │
│   	                         │                             │         type: 'string'      │
│   	                         │                             │       }, {                  │
│   	                         │                             │         type: 'number'      │
│   	                         │                             │       }                     │
│   	                         │                             │    ],                       │
│   	                         │                             │    additionalItems: false,  │
│   	                         │                             │    minItems: 2,             │
│   	                         │                             │    maxItems: 2,             │
│   	                         │                             │ }                           |
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ enum Foo {                     │ enum Foo {                  │ const T = {                 │
│   A,                           │   A,                        │    enum: [0, 1]             │
│   B                            │   B                         │ }                           │
│ }                              │ }                           │                             │
│                                │                             │                             │
│ type T = Type.Enum(Foo)        │ type T = Foo                │                             │
│                                │                             │                             │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Union([         │ type T = string | number    │ const T = {                 │
│   Type.String(),               │                             │    anyOf: [{                │
│   Type.Number()                │                             │       type: 'string'        │
│ ])                             │                             │    }, {                     │
│                                │                             │       type: 'number'        │
│                                │                             │    }]                       │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Intersect([     │ type T = {                  │ const T = {                 │
│    Type.Object({               │    a: string                │   allOf: [{                 │
│         a: Type.String()       │ } & {                       │     type: 'object',         │
│    }),                         │    b: number                │     properties: {           │
│    Type.Object({               │ }                           │        a: {                 │
│       b: Type.Number()         │                             │          type: 'string'     │
│   })                           │                             │        }                    │
│ })                             │                             │     },                      │
│                                │                             │     required: ['a']         │
│                                │                             │   }, {                      │
│                                │                             │     type: 'object',         │
│                                │                             │     properties: {           │
│                                │                             │       b: {                  │
│                                │                             │         type: 'number'      │
│                                │                             │       }                     │
│                                │                             │     },                      │
│                                │                             │     required:['b']          │
│                                │                             │   }]                        │
│                                │                             │ }                           │
└────────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

<a name="Modifiers"></a>

### Modifiers

TypeBox provides modifiers that can be applied to an objects properties. These allows for `optional` and `readonly` to be applied to that property. The following table illustates how they map between TypeScript and JSON Schema.

```typescript
┌────────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ JSON Schema                 │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                 │
│   name: Type.Optional(         │    name?: string,           │   type: 'object',           │
│      Type.String(),            │ }                           │   properties: {             │
│   )	                         │                             │      name: {                │
│ })  	                         │                             │        type: 'string'       │
│   	                         │                             │      }                      │
│   	                         │                             │   }                         │
│   	                         │                             │ }                           │
│   	                         │                             │                             │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                 │
│   name: Type.Readonly(         │    readonly name: string,   │   type: 'object',           │
│      Type.String(),            │ }                           │   properties: {             │
│   )	                         │                             │      name: {                │
│ })  	                         │                             │        type: 'string'       │
│   	                         │                             │      }                      │
│   	                         │                             │   },                        │
│                                │                             │   required: ['name']        │
│   	                         │                             │ }                           │
│   	                         │                             │                             │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Object({        │ type T = {                  │ const T = {                 │
│   name: Type.ReadonlyOptional( │    readonly name?: string,  │   type: 'object',           │
│      Type.String(),            │ }                           │   properties: {             │
│   )	                         │                             │      name: {                │
│ })  	                         │                             │        type: 'string'       │
│   	                         │                             │      }                      │
│   	                         │                             │   }                         │
│                                │                             │ }                           │
│   	                         │                             │                             │
└────────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
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

<a name="Functions"></a>

### Functions

In addition to JSON schema types, TypeBox provides several extended types that allow for `function` and `constructor` types to be composed. These additional types are not valid JSON Schema and will not validate using typical JSON Schema validation. However, these types can be used to frame JSON schema and describe callable interfaces that may receive JSON validated data. These types are as follows.

```typescript
┌────────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
│ TypeBox                        │ TypeScript                  │ Extended Schema             │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Constructor([   │ type T = new (              │ const T = {                 │
|    Type.String(),              │  arg0: string,              │   type: 'constructor'       │
│    Type.Number(),              │  arg1: number               │   arguments: [{             │
│ ], Type.Boolean())             │ ) => boolean                │      type: 'string'         │
│                                │                             │   }, {                      │
│                                │                             │      type: 'number'         │
│                                │                             │   }],                       │
│                                │                             │   returns: {                │
│                                │                             │      type: 'boolean'        │
│                                │                             │   }                         │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Function([      │ type T = (                  │ const T = {                 │
|    Type.String(),              │  arg0: string,              │   type : 'function',        │
│    Type.Number(),              │  arg1: number               │   arguments: [{             │
│ ], Type.Boolean())             │ ) => boolean                │      type: 'string'         │
│                                │                             │   }, {                      │
│                                │                             │      type: 'number'         │
│                                │                             │   }],                       │
│                                │                             │   returns: {                │
│                                │                             │      type: 'boolean'        │
│                                │                             │   }                         │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Promise(        │ type T = Promise<string>    │ const T = {                 │
|    Type.String()               │                             │   type: 'promise',          │
| )                              │                             │   item: {                   │
│                                │                             │      type: 'string'         │
│                                │                             │   }                         │
│                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Undefined()     │ type T = undefined          │ const T = {                 │
|                                │                             │   type: 'undefined'         │
|                                │                             │ }                           │
├────────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ const T = Type.Void()          │ type T = void               │ const T = {                 │
|                                │                             │   type: 'void'              │
|                                │                             │ }                           │
└────────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

<a name="Interfaces"></a>

### Interfaces

It is possible to create interfaces from TypeBox types. Consider the following code that creates a `ControllerInterface` type that has a single function `createRecord(...)`. The following is how one would approach this in TypeScript.

```typescript
interface CreateRecordRequest {
    data: string
}

interface CreateRecordResponse {
    id: string
}

interface ControllerInterface {
    createRecord(record: CreateRecordRequest): Promise<CreateRecordResponse>
}

class Controller implements ControllerInterface {
    async createRecord(record: CreateRecordRequest): Promise<CreateRecordResponse> {
        return { id: '1' }
    }
}
```
The following is the TypeBox equivalent.
```typescript

import { Type, Static } from '@sinclair/typebox'

type CreateRecordRequest = Static<typeof CreateRecordRequest>
const CreateRecordRequest = Type.Object({
    data: Type.String()
})
type CreateRecordResponse = Static<typeof CreateRecordResponse>
const CreateRecordResponse = Type.Object({
    id: Type.String()
})

type ControllerInterface = Static<typeof ControllerInterface>
const IController = Type.Object({
    createRecord: Type.Function([CreateRecordRequest], Type.Promise(CreateRecordResponse))
})

class Controller implements ControllerInterface {
    async createRecord(record: CreateRecordRequest): Promise<CreateRecordResponse> {
        return { id: '1' }
    }
}
```
Because TypeBox encodes the type information as JSON schema, it now becomes possible to reflect on the JSON schema to produce sharable metadata that can be used as machine readable documentation.
```typescript

console.log(JSON.stringify(ControllerInterface, null, 2))
// outputs:
//
// {
//   "type": "object",
//   "properties": {
//     "createRecord": {
//       "type": "function",
//       "arguments": [
//         {
//           "type": "object",
//           "properties": {
//             "data": {
//               "type": "string"
//             }
//           },
//           "required": [
//             "data"
//           ]
//         }
//       ],
//       "returns": {
//         "type": "promise",
//         "item": {
//           "type": "object",
//           "properties": {
//             "id": {
//               "type": "string"
//             }
//           },
//           "required": [
//             "id"
//           ]
//         }
//       }
//     }
//   },
//   "required": [
//     "createRecord"
//   ]
// }
```

<a name="Validation"></a>

### Validation

TypeBox does not provide JSON schema validation out of the box and expects users to select an appropriate JSON schema validation library. TypeBox schemas should match JSON Schema draft 6. So any validation library capable of draft 6 should be fine.

A good validation library to use is [AJV](https://www.npmjs.com/package/ajv). The following demonstrates basic usage.

```typescript
import { Type } from '@sinclair/typebox'

import * as Ajv from 'ajv'

const User = Type.Object({
    name:  Type.String(),
    email: Type.String({ format: 'email' })
})

const ajv = new Ajv()

const user = { name: 'dave', email: 'dave@domain.com' }

const isValid = ajv.validate(User, user)
//
// -> true
```