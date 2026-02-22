<div align='center'>

<h1>TypeBox</h1>

<p>JSON Schema Type Builder with Static Type Resolution for TypeScript</p>

<img src="typebox.png" />

<br />
<br />

[![npm version](https://badge.fury.io/js/typebox.svg)](https://badge.fury.io/js/typebox)
[![Downloads](https://img.shields.io/npm/dm/typebox.svg)](https://www.npmjs.com/package/typebox)
[![Build](https://github.com/sinclairzx81/typebox/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typebox/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Install

```bash
$ npm install typebox
```


## Usage

```typescript
import Type from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Type.Static<typeof T>                      // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```

## Overview

[Documentation](https://sinclairzx81.github.io/typebox/)

TypeBox is a runtime type system that creates in-memory JSON Schema objects that infer as TypeScript types. The schematics produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type system that can be statically checked by TypeScript and validated at runtime using standard JSON Schema.

This library is designed to allow JSON Schema to compose similar to how types compose within TypeScript's type system. It can be used as a simple tool to build up complex schematics or integrated into REST and RPC services to help validate data received over the wire.

License: MIT

## Contents


- [Type](#Type)
- [Value](#Value)
- [Script](#Script)
- [Schema](#Schema)
- [Legacy](#Legacy)
- [Contribute](#Contribute)


<a name="Type"></a>

## Type

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/type/overview) | [Example](https://tsplay.dev/NaMoBN)

TypeBox provides many functions to create JSON Schema types. Each function returns a small JSON Schema fragment that can be composed into more complex types. TypeBox includes a set of functions that are used to construct JSON Schema compliant schematics as well as a set of extended functions that return schematics for constructs native to JavaScript.

## Example

The following creates a JSON Schema type and infers with Static.

```typescript
import Type from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Type.Static<typeof T>                      // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```

Schema options can be passed on the last argument of any given type.

```typescript
const T = Type.String({                             // const T = {
  format: 'email'                                   //   type: 'string',
})                                                  //   format: 'email'
                                                    // }

const S = Type.Number({                             // const S = {
  minimum: 0,                                       //   type: 'number',
  maximum: 100                                      //   minimum: 0,
})                                                  //   maximum: 100
                                                    // }
```

<a name="Value"></a>

## Value

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/value/overview) | [Example](https://tsplay.dev/W4YE1w)

The Value submodule provides functions for validation and other typed operations on JavaScript values. It includes functions such as Check, Parse, Clone, Encode, and Decode, as well as advanced functions for performing structural Diff and Patch operations on dynamic JavaScript values.

```typescript
import Value from 'typebox/value'
```

### Example

The following uses the Value module to Parse a value. 

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const A = Value.Parse(T, {                          // const A: {
  x: 1,                                             //   x: number,
  y: 0,                                             //   y: number,
  z: 0                                              //   z: number
})                                                  // } = ...
```

## Script

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/script/overview) | [Example 1](https://tsplay.dev/N9rQ8m) | [Example 2](https://tsplay.dev/NnrJoN)

TypeBox includes a runtime TypeScript DSL engine that can transform TypeScript syntax into JSON Schema. The engine is implemented at runtime and within the TypeScript type system.

```typescript
// ----------------------------------------------------------
// Script
// ----------------------------------------------------------
const T = Type.Script(`{ 
  x: number, 
  y: string, 
  z: boolean 
}`)

// ----------------------------------------------------------
// Reflect
// ----------------------------------------------------------
T.type                                              // 'object'
T.required                                          // ['x', 'y', 'z']
T.properties                                        // { x: ..., y: ..., z: ... }

// ----------------------------------------------------------
// Computed
// ----------------------------------------------------------
const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)

// ----------------------------------------------------------
// Inference
// ----------------------------------------------------------
type S = Type.Static<typeof S>                      // type S = {
                                                    //   x: number | null,
                                                    //   y: string | null,
                                                    //   z: boolean | null
                                                    // }
```

<a name="Schema"></a>

## Schema

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/schema/overview)

The Schema submodule is a low level JSON Schema spec compliant validation system that supports Drafts 3 through to 2020-12. This validation system is decoupled from both Type.* and Value.* submodules and is designed to be an ultra lightweight, high performance alternative to Ajv for compiling and validating with native JSON Schema.

```typescript
import Schema from 'typebox/schema'
```

### Example

The following uses the Schema submodule to compile and parse from JSON Schema.

```typescript
// ----------------------------------------------------------
// Compile
// ----------------------------------------------------------
const C = Schema.Compile({
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
})

// ----------------------------------------------------------
// Parse
// ----------------------------------------------------------
const R = C.Parse({  x: 0, y: 0, z: 0 })            // const R: {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...
```

## Legacy

If upgrading from `@sinclair/typebox` 0.34.x refer to the 1.0 migration guide at the following URL.

[Migration Guide](https://github.com/sinclairzx81/typebox/blob/main/changelog/1.0.0-migration.md)

Most types created with 0.34.x are compatible with V1, and it is possible to run both `typebox` and `@sinclair/typebox` packages side by side. 

[Compatibility](https://tsplay.dev/Wzr2rW)

```typescript
import { Type } from '@sinclair/typebox'            // TB: 0.34.x
import { Static } from 'typebox'                    // TB: 1.0.0

// ----------------------------------------------------------
// Legacy Types
// ----------------------------------------------------------
const A = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const B = Type.Object({
  a: Type.Number(),
  b: Type.Number(),
  c: Type.Number()
})

const C = Type.Composite([A, B])

// ----------------------------------------------------------
// Modern Inference
// ----------------------------------------------------------
type C = Static<typeof C>                           // type C = {
                                                    //   x: number;
                                                    //   y: number;
                                                    //   z: number;
                                                    //   a: number;
                                                    //   b: number;
                                                    //   c: number;
                                                    // }

// ----------------------------------------------------------
// Modern Compile
// ----------------------------------------------------------
import Schema from 'typebox/schema'

const R = Schema.Compile(C).Check({ ... })
```

Revision 0.34.x is actively maintained at the following URL.

[TypeBox 0.34.x](https://github.com/sinclairzx81/typebox-legacy)

Please submit non-1.0 issues to this repository.

## Contribute

TypeBox is open to community contribution. Please ensure you submit an issue before submitting a pull request. The TypeBox project prefers open community discussion before accepting new features.