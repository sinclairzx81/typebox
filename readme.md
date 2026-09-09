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

const T = Type.Object({                     // const T = {
  x: Type.Number(),                         //   type: 'object',
  y: Type.Number(),                         //   required: ['x', 'y', 'z']
  z: Type.Number()                          //   properties: {
})                                          //     x: { type: 'number' },
                                            //     y: { type: 'number' },
                                            //     z: { type: 'number' }
                                            //   },
                                            // }

type T = Type.Static<typeof T>              // type T = {
                                            //   x: number,
                                            //   y: number,
                                            //   z: number
                                            // }

```

## Overview

[Documentation](https://sinclairzx81.github.io/typebox/)

TypeBox is a runtime type system that creates in-memory JSON Schema objects that infer as TypeScript types. The schematics produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type that can be statically checked by TypeScript and runtime checked using standard JSON Schema validation.

This library is designed to allow JSON Schema to compose similar to how types compose within TypeScript's type system. It can be used as a simple tool to build up complex schematics or integrated into REST and RPC services to help validate data received over the wire.

License: MIT

## Contents

- [Type](#Type)
- [Script](#Script)
- [Schema](#Schema)
- [Versions](#Versions)
- [Contribute](#Contribute)


<a name="Type"></a>

## Type

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/type/overview) | [Example](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgYwgDsBneAVUdSjgF5EiA6APLEAVqhowAFAG84sufIWLZAemVw6TVu048plWcAAmALl5o+AZRhRg9AOYSAlABolb9wtVzCaU3ggiYjB4zvpw9ACGIKimyOZWNvZOrh6pnmqyUKgAjgCuwFkmcADaYaggEcAANrH8CbYOMhjQFTB+5ZVVeHAAvo5uXvJ4RiFwlH1pk1MDGXJ4kdGjYdMrK4NzHdVUqztT6wC6obvHHutg2GiwwKiMpnonD4rrBkUyPjH4zIl23T1HjwC4M9wlEPm8iH4vg1fv9AQ9gZsanAZMs4cdgbJ3pDrNDXKi0TsMZgWhE2vhEd18QS1rNZD0qdS9rN6Yzdl56ZR3nA2BxuGZUJYYKTgDQADzvCAYbnaAB8TLgXJ5OmRDNZaXWRlMUPssLV03WCw+2rsur1k3WiK1OPsqrNM16QA)

TypeBox types are JSON Schema fragments that compose into more complex types. The library provides a core set of types for constructing JSON Schema compliant schematics, alongside extended types designed to model constructs native to JavaScript and TypeScript. The JSON Schema schematics produced by TypeBox can be passed directly to any compliant validator.

### Example

The following creates a User type and infers with Static.

```typescript
import Type from 'typebox'

const User = Type.Object({                       // const User = {
  id: Type.String(),                             //   type: 'object',
  name: Type.String(),                           //   required: [
  email: Type.String({ format: 'email' })        //     'id', 
})                                               //     'name', 
                                                 //     'email'
                                                 //   ],
                                                 //   properties: {
                                                 //     id: { type: 'string' },
                                                 //     name: { type: 'string' },
                                                 //     email: { 
                                                 //       type: 'string', 
                                                 //       format: 'email' 
                                                 //     }
                                                 //   }
                                                 // }

type User = Type.Static<typeof User>              // type User = {
                                                  //   id: string,
                                                  //   name: string,
                                                  //   email: string
                                                  // }
```

## Script

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/script/overview) | [Example 1](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgYwgDsBneAWQEMYALOAXkSIB0AZRpRgYGAAoABpThxCaOADVUNGNAAsvOAG84ZAFxx6AVxDFUUADRwkxsxau2AXg-OWbcAO7unUOABfOQUiFTUNKABmHX0jEw9nOz9PVxSrIJDFdFV1aAAmWIN0r3sE-0zpAEpqOiZ4AHEoNjBOYBpGHWQ0YVFxKXYuW1l5bPDYVDJYkPlIRmAYYAZjXMjNaxmTaBA2ABsViOgojfl5UwA3A7yofJDg0bCG1BxUGCgkadO4c6tFmlRGAcJmQANoAXROp2A9AAJu0ASVwXcsmFBlZgHtPqc2BZgKh6DArmtIfI4RgMKZGKgiVoSXBGGgaKZdmwoDSoJpkQ8lCwAdw+LpNgBzZ4gV7vYxPF5vJB0nYwdF7YxosR7ZHVahjXmMfn8HpCGAcdoAHmyEAwcCaLTaHRBeG1nDwYIAfPIAPRu0I8vlYr5+-0BwNBoMe04i6USvRwAQxoJ04MJxNJ0PyeWK-ZRmMCTJJ3N5wOhwJAA) | [Example 2](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgFkBDGAC0YgBMBXAG1WoBjCADsAzvABqqQTGgAWOAF5ERAHQB5YgCsZMABQBvOGQBcqtGoBy3EMVRR9ASgA0cJOeSWbdh87cAXp7qPvaOrnAA7sHetmHOcAC+TpTC4lJ60ADMyhaomjp6RiYx+aF+ER551nEVgaU1vuFJKWkScNKy0ABMuV75WrqyxWbV5eFuVf2N8U4t1HRwAOJQTGCswIJiHDz8QqLt0rCoZH3qg0WGlHBwkGLAMMCi5p1yUPIu13Ai0CBMvC9MlAsp8btwAG6ArpQbqUZKpA7wJaoHCoGBQJBnSwXYZXG7ghyPQSoMQNACCUFWSH0RxgJ1cX2AIk4mxJ5MpTGp03GzhS8La8GYdKgwH+WIGhVxXyYdmAqBEMChbw+XxZGAw3DEqCVClBcDEaEEfCYUB170+-MRjBJ7BU0xxBjxcAA5iiQGiMeZkaj0Ug9X9haKAYwWA4g3CUpRCGhrWJbdUAMowFibAA80ZRGFjrAAfDd8wXC4sM9nck7CxXK1XqzX84sbq6fZ64MY1G2knra13u1363AA2H-uZW+3El8exPJ3X6IkgA)

TypeBox includes a micro TypeScript engine that can transform TypeScript definitions to JSON Schema. The engine is fully type-safe and supports many programmable constructs including Conditional, Mapped, Indexed, Generics, Distributive Generics, and more.

### Example

Syntax highlighting is available via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sinclairzx81.typebox-script).

```typescript
import Type from 'typebox'

const Math = Type.Script(`
  type Vector4 = { x: number, y: number, z: number, w: number }
  type Vector3 = { x: number, y: number, z: number }
  type Vector2 = { x: number, y: number }
`)

const Graphics = Type.Script(Math, `
  type Vertex = {
    position: Vector4,
    normal: Vector3,
    uv: Vector2
  }
  type Geometry = {
    vertices: Vertex[],
    indices: number[]
  }
  type Material = {
    ambient: Vector4,
    diffuse: Vector4,
    specular: Vector4
  }
  type Mesh = {
    geometry: Geometry,
    material: Material
  }
`)

type Mesh = Type.Static<typeof Graphics['Mesh']>  // type Mesh = {
                                                  //   geometry: { ... },
                                                  //   material: { ... }
                                                  // }
```

<a name="Schema"></a>

## Schema

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/schema/overview) | [Example 1](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAZQMYAsCmICGcBmUIhwDkMAnmGgEYQAeA9AM6oaZEBQokscAKuWrnyES-ajXZs6dOAGECYYABs0bNkggA7BvABqaJDGhwAvImZYAdHPBK0ACj4ULyKMDAw7AAwDebOHBoALjgNAFcQSjQoPzhSYLCIqJiAL3jwyOiAX08AShzVKVl0JABrVXUteAA3TEVgABMTOD0DaCtikrtvAOCARgAaWOCABkHUuGG4TJz-OEKK7Tgauvrg6ghlTA0C6QAFTCgGFTVNRag0BlDFeFMWwygLfcP7bqC4AaGJsZGpmbnpBbwc6Xa7BbqzfwxCHQmGwuHwhGFfxvBIZKEIjGYrH+JGfVFJbGEokw3HjfHRYmUomFTJAA) | [Example 2](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAZQMYAsCmICGcBmUIhwDkMAnmGgEYQAeA9AM6oaZEBQokscAKuWrnyES-ajXZs6dOAGECYYABs0bNkggA7BvABqaJDGhwAvImZYAdHPBK0ACj4ULAeUoArfTDsBvNnDg0AFy8-BYAcgCuIJRoUHYAlAA0fnCkwY5o4VExcUkpAF7poZHRsQlsAL7x8apSsuhIANaq6lrwAG6YisAAJiZwegbQVg2NPgHBAIyJqcEADDOFcHNwVf5wda3acJ3dPcHUEMqYGrXSAAqYUAwqaprbUGgMEYrwpoOGUBaX1-beE3BprNlot5qt4v5Nvd4I9nq9gv91v4UkjUWj0RjMVi6v4gnANNlYiisSTSWTIdJ-Gl8YSoMTyQzGRT1ksCaU6UzOYy6hUgA) | [Example 3](https://www.typescriptlang.org/play/#code/JYWwDg9gTgLgBAZQMYAsCmICGcBmUIhwDkMAnmGgEYQAeA9AM6oaZEBQbddcAwgWMAA2aDkggA7BvABqaJDGhwAvImZYAdH3BC0ACgDebOHDIUAXMQiUAVnJhEANEbhQ0ARwCuwVwBMLAbSIaR2JSEKIALyIAXSdjMHwKWGA0BgtDY2MadJNyNAsicQ8QSjQoIjgAXzjM0hzTfOIikrKK6udjCPq8gubS8qrnSrZKgEoOLl50JABrUQkpOAA3TEFgH2U4WXloTWmZgzhsuABGBzg6uAAGc67rqtHMybFJeBW1vzhqCGFMcQnuAAFTBQBgiNgvRauBgeQTwFTbBRQdTA0F6fRHCxnC4WG5wO5XB7GZ4LeDQ2EwHKZYwdal0+kMxlMpmTLIWPplWnM7k83lwVk4uAcqBcvli8X87iddnFfqiiUK5mTSpAA)

TypeBox includes a high-performance JSON Schema JIT compiler that supports Draft 3 through to 2020-12. The compiler is designed to be a lightweight industry-grade alternative to Ajv and offers improved compilation and validation performance. It also offers automatic fallback to dynamic validation in JIT restricted environments such as Cloudflare Workers.

The compiler is available via optional sub module import.

```typescript
import Schema from 'typebox/schema'
```

### Compile

The compiler accepts TypeBox types as well as plain JSON Schema objects, and returns a Validator instance which can be used to check values. The following compiles a Vector type.

```typescript
import Schema from 'typebox/schema'

// Compile

const Vector = Schema.Compile(Type.Script(`{
  x: number
  y: number
  z: number
}`))

// Check

const valid = Vector.Check({ x: 1, y: 0, z: 0 })   // const valid: boolean

// Parse

const result = Vector.Parse({ x: 1, y: 0, z: 0 })  // const result: {      
                                                   //   x: number
                                                   //   y: number
                                                   //   z: number
                                                   // }
```

### Compatibility

[JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) | [JSON Schema Compliance Suite](https://github.com/sinclairzx81/json-schema-compliance-suite)

TypeBox supports all versions of JSON Schema and is heavily tested against the official JSON Schema Test Suite. It prioritizes compatibility with modern specifications while also maintaining broad support for legacy versions provided their semantics are not in conflict with modern specifications.

| Spec | 3 | 4 | 6 | 7 | 2019-09 | 2020-12 | v1 |
|:-----|:--|:--|:--|:--|:--|:--|:--|
| additionalItems | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| additionalProperties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| allOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| anchor | - | - | - | - | ✅ | ✅ | ✅ |
| anyOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| boolean_schema | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| const | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| contains | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| content | - | - | - | - | ✅ | ✅ | ✅ |
| default | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| definitions | - | 1/2 | ✅ | ✅ | - | - | - |
| defs | - | - | - | - | ✅ | ✅ | - |
| dependencies | 17/18 | ✅ | ✅ | ✅ | - | - | - |
| dependentRequired | - | - | - | - | ✅ | ✅ | ✅ |
| dependentSchemas | - | - | - | - | ✅ | ✅ | ✅ |
| dynamicRef | - | - | - | - | - | ✅ | ✅ |
| enum | 16/18 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| exclusiveMaximum | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| exclusiveMinimum | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| if-then-else | - | - | - | ✅ | ✅ | ✅ | ✅ |
| infinite-loop-detection | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| items | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxContains | - | - | - | - | ✅ | ✅ | ✅ |
| maximum | 13/14 | 13/14 | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxLength | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxProperties | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minContains | - | - | - | - | ✅ | ✅ | ✅ |
| minimum | 12/13 | 16/17 | ✅ | ✅ | ✅ | ✅ | ✅ |
| minItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minLength | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minProperties | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| multipleOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| not | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| oneOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pattern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| patternProperties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| prefixItems | - | - | - | - | - | ✅ | ✅ |
| properties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| propertyNames | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| recursiveRef | - | - | - | - | ✅ | - | - |
| ref | 23/27 | 38/45 | 69/70 | 77/78 | ✅ | ✅ | ✅ |
| refRemote | 7/8 | 11/17 | ✅ | ✅ | ✅ | ✅ | ✅ |
| required | 3/4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| type | 73/80 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| unevaluatedItems | - | - | - | - | ✅ | ✅ | ✅ |
| unevaluatedProperties | - | - | - | - | ✅ | ✅ | ✅ |
| uniqueItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Performance

TypeBox tracks performance against AJV8 only as the defacto performance standard. For broader comparative benchmarks, refer to the following community maintained projects.

[Runtime Benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/) | [Schema Benchmarks](https://schemabenchmarks.dev/)

### Compile

The following table shows compile performance for various JSON Schema structures. These benchmarks measure the time required to build and runtime JIT schematics. Faster compilation results in faster application startup.

```python
┌──────────────────────┬──────────────┬──────────────┐
│ Compile              │ TB1X         │ AJV8         │
├──────────────────────┼──────────────┼──────────────┤
│ Boolean              │  54.9K ops/s │     7K ops/s │
│ Number               │ 154.2K ops/s │   7.8K ops/s │
│ String               │ 161.4K ops/s │   9.7K ops/s │
│ Null                 │ 111.9K ops/s │   8.9K ops/s │
│ Literal_String       │  34.6K ops/s │   7.5K ops/s │
│ Literal_Number       │  78.1K ops/s │   7.6K ops/s │
│ Literal_Boolean      │  79.7K ops/s │   8.4K ops/s │
│ Pattern              │  92.1K ops/s │   6.1K ops/s │
│ Object_Open          │  18.6K ops/s │   1.3K ops/s │
│ Object_Close         │    17K ops/s │    975 ops/s │
│ Object_Vector3       │  33.3K ops/s │   3.4K ops/s │
│ Object_Basis3        │  18.9K ops/s │    858 ops/s │
│ Intersect_And        │  63.5K ops/s │   3.6K ops/s │
│ Intersect_Structural │  25.7K ops/s │   1.7K ops/s │
│ Union_Or             │  58.2K ops/s │   3.3K ops/s │
│ Union_Structural     │  33.7K ops/s │     2K ops/s │
│ Tuple_Values         │  19.5K ops/s │     2K ops/s │
│ Tuple_Objects        │     4K ops/s │    388 ops/s │
│ Array_Numbers_4      │  90.7K ops/s │   4.3K ops/s │
│ Array_Numbers_8      │ 121.8K ops/s │   3.8K ops/s │
│ Array_Numbers_16     │ 116.6K ops/s │   3.9K ops/s │
│ Array_Objects_Open   │  22.6K ops/s │    802 ops/s │
│ Array_Objects_Close  │  18.4K ops/s │    930 ops/s │
└──────────────────────┴──────────────┴──────────────┘
```

### Validate

The following table shows validation performance for various JSON Schema structures. These benchmarks measure overall validation throughput for compiled schematics.

```python
┌──────────────────────┬──────────────┬──────────────┐
│ Validate             │ TB1X         │ AJV8         │
├──────────────────────┼──────────────┼──────────────┤
│ Boolean              │ 192.2M ops/s │ 189.5M ops/s │
│ Number               │ 112.4M ops/s │    61M ops/s │
│ String               │ 113.7M ops/s │  64.1M ops/s │
│ Null                 │ 112.8M ops/s │  64.9M ops/s │
│ Literal_String       │   108M ops/s │  62.9M ops/s │
│ Literal_Number       │ 113.5M ops/s │  63.2M ops/s │
│ Literal_Boolean      │ 109.2M ops/s │  64.1M ops/s │
│ Pattern              │  26.5M ops/s │  22.4M ops/s │
│ Object_Open          │    78M ops/s │  47.2M ops/s │
│ Object_Close         │  38.6M ops/s │  27.6M ops/s │
│ Object_Vector3       │    91M ops/s │  51.3M ops/s │
│ Object_Basis3        │  41.1M ops/s │  27.4M ops/s │
│ Intersect_And        │ 107.6M ops/s │  59.9M ops/s │
│ Intersect_Structural │  83.6M ops/s │  46.3M ops/s │
│ Union_Or             │    95M ops/s │   7.9M ops/s │
│ Union_Structural     │  84.5M ops/s │  52.3M ops/s │
│ Tuple_Values         │  74.7M ops/s │    53M ops/s │
│ Tuple_Objects        │  32.9M ops/s │  22.3M ops/s │
│ Array_Numbers_4      │  93.3M ops/s │  55.1M ops/s │
│ Array_Numbers_8      │  90.3M ops/s │  50.8M ops/s │
│ Array_Numbers_16     │  76.8M ops/s │  39.6M ops/s │
│ Array_Objects_Open   │  28.7M ops/s │  20.4M ops/s │
│ Array_Objects_Close  │  10.3M ops/s │  10.8M ops/s │
└──────────────────────┴──────────────┴──────────────┘
```

<a name="Versions"></a>

## Versions

TypeBox ships two distinct versions that span two generations of the TypeScript compiler. 

| TypeBox | TypeScript | Description |
| :--- | :--- | :--- |
| 1.x | 6.0 - 7.0+ | **Latest.** Developed against the TypeScript 7 native compiler. Provides advanced type inference and native JSON Schema 2020-12 support. Includes backwards compatibility with `0.x` types. **ESM only.** |
| 0.x | 5.0 - 6.0 | **LTS.** Developed against older TypeScript versions and actively maintained under Long Term Support. Compatible with both **ESM and CJS**. Issues should be submitted to the [Sinclair TypeBox](https://github.com/sinclairzx81/sinclair-typebox) repository. |

## Contribute

TypeBox is open to community contribution. Please ensure you submit an issue before submitting a pull request. The TypeBox project prefers open community discussion before accepting new features.