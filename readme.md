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
  y: Type.Number(),                         //   properties: {
  z: Type.Number()                          //     x: { type: 'number' },
})                                          //     y: { type: 'number' },
                                            //     z: { type: 'number' }
                                            //   },
                                            //   required: ['x', 'y', 'z']
                                            // }

type T = Type.Static<typeof T>              // type T = {
                                            //   x: number,
                                            //   y: number,
                                            //   z: number
                                            // }

```

## Overview

[Documentation](https://sinclairzx81.github.io/typebox/)

TypeBox is a runtime type system that creates in-memory JSON Schema objects that infer as TypeScript types. The schematics produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type that can be statically checked by TypeScript and validated at runtime using standard JSON Schema.

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

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/type/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgFonmXW32POvueHb7kafo16ix4ic2oBjCADsAzvACqC1FDgBeREQB0AeWIArVNJgAKAN5wbtu-Yc26cWYpVqN2y5RvAAJgBcOmi6AMowUMByAObmAJQANI7JKfbONoRoQXgQxqYweAk+cHIAhiCoQYKoYRFRsYmpTQ7pcGDYaLDAqApB3jaoIKXAADZVeuGRMVaY0EMw2YPDI3hwAL5xya2+gXDWmZX4SlPRq2tFG81X11v0dmUVfXAH2cf1Z0U3X99w23BLoyexR+INSfwyRFedRihTgwNBCLSd3sGDmpQW+ABKzhiNxdj+a3heIRrUJxLxrSgqAAjgBXYBU3YAbSJ5J+fzw-lhrLZXw5D1Q3N5JORNjwWKowtBrQAujypc1nIThJJVWr1XxnOF0cBpCqNQbDZxqAc4Kp1FpgjVtTBdQAeA4QDBmjwAPmuzlN5s8e3lCqarX8QTeMU+-u+rQFweh0TD4ZurSx0ZOfvjjiVQA)

TypeBox types are JSON Schema fragments that compose into more complex types. The library offers a set of types used to construct JSON Schema compliant schematics as well as a set of extended types used to model constructs native to the JavaScript language. The schematics produced by TypeBox can be passed directly to any JSON Schema compliant validator.

### Example

The following creates a User type and infers with Static.

```typescript
import Type from 'typebox'

// Type

const User = Type.Object({                       // const User = {
  id: Type.String(),                             //   type: 'object',
  name: Type.String(),                           //   properties: {
  email: Type.String({ format: 'email' })        //     id: { type: 'string' },
})                                               //     name: { type: 'string' },
                                                 //     email: { 
                                                 //       type: 'string', 
                                                 //       format: 'email' 
                                                 //     }
                                                 //   }
                                                 //   required: [
                                                 //     'id', 
                                                 //     'name', 
                                                 //     'email'
                                                 //   ]
                                                 // }

// Static

type User = Type.Static<typeof User>              // type User = {
                                                  //   id: string,
                                                  //   name: string,
                                                  //   email: string
                                                  // }

```

## Script

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/script/overview) | [Example 1](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgFonmXW32POv3b7k0AdAGUAxlGBgYACjwC5eAJS9G3VWvXdqdOADkAhiFQBnMHpGpKIiADsj8ALJ6YACzgBeREWFiJ0gAaUcHCEaHAAaqgiMNAATO5wAN5wZABccNYAriDEqFAANHBIaZnZuXAAvoHBROGR0VAAzPEAogBuegA2GU6oADwRUbFwAGSJcABexVk5UBUAfFUh6AP1ACwt7V09-XXQTaNJAO5TpbPlC35KygAiqGjWACao1vD6hiZmFla28En2xq5yvF+KhvOJJFIknIBI4XBUCn4gosahFYKgyPEElUgpAjMAYMAbGkVtBVnlseloCBOsTdo1yUEghlWrTBlAYlVKkElnAAOKoHCoGBQJCYimtXIE8xGWlosgAbQAugzGcBHsBpScZkrOcjQrDcsBOmLGXADMRgM8YKy1iqgg9gBgMBkjKgbaS7XATJEMh09FB3VBVrruTV-kZXB4saaAOYCwzCop8+NCkWe6kwQ00uAG8SdXWXLT0ABKGReoHQxdQGA6dUJ1ko4ecAjA2DQsEtRgEccFiZbbclnYEEo70oE+NQIC7rYg7YJxhbEDxBJs-dng4XZEbALXc6HPYTIt3G67I6lC4nU+PHYX1ipnWv867W6bj-3Kb7M73C7PGovmavL8TwEZk303bcIzArsMyzDooIEB0nRdUEgJvZ8IObVCnwEGC8zgrCh3NS0Xngl8dwIhdcKNfCBzQgRvREX1-VIos4CEGAnA1OAAElrAwXJnnMShnWsKJ6zgKBnieKApHeZw0hBYQOKlXolggDAcwBOYFESKo5O7D8j1-aV5QABkVRdl3rAQtyCfSD1TJBh0HEzzIEO8oGpODbLgezDKc4zjDMizQJ8-SqIfRDnVdGy9J3CK4KIq1Yrs+Kejw+i0EYv0oFi8ogA) | [Example 2](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgFonmXW32POv3b7k0AdACpejbuImTu1OnAByAQxCoAzmAUBjVJQB2S1eq1wAsgpgALOAG9KcOKjKRYcDRB0r4ANVQaY0AExwALyIRAIA8sQAVj4wABRWcGQAXKGCcgCuIMSoUHEAlAA0cEip-KgCmdm5BXAAvvm29o7Q8K7uXrHQAMzBaRUAogBuCgA2GWaoceUCAJI6MLkqsXEA2t6+AcUzkTG+CXAAXmVhVTl5+fX5ALr5jXYOTm1uHnAbflAALH0zw2MTi2mYXmiygy326y6UG62zCuxWiQA7id0llzrUGrdGnUZPQACKoNA6AAmqAW8n0ak02nar28sAcPzh0QRTUgKmAMGAblSpgsAne0E+hSaOmgIDGvLM5gFUJhTQyQyl-MFUH8lAalFp8AA4qgcKgYFAkEzBPD9jY7ENclytCoURUAIJQKAKJBxemLMhFJrAEnAO0OgTO13umZnGp3DWNbUmSZQYBjU0Vc3xS1wJTEYBkmDKmWq4VNYnADAYDLLPOyzZfEV2NQ+DKjBRQSsF6Nal7wYyqSwhHYsi1NADm+uURtKcD1BvHtbgEtBidGytyi-bogAShkFqB0OvUBhRrFuTpKN2VDKwNg0LBsyoBCPp8aBJeINeuaoBNab3aBJzUCA7xfN9b2fCAOS5NxnyvG0QLIU8eyg18YI-B8xyfIDkLvL9bQ-P8AMQ4CPzFKAJVGAjMIEOCzwvaCbxQ0dDXQ2j3ywmCfzwwDmJAxVyLou8qIQjC+IEecVzGXiWIEYtS3LCohMkgTzwkkDRITcT5JAzNswWZSP0UmikOE1TF10u96w0Rtm1MyjcTgABlGAzADOB5gwXIyS0Sgyx0XxjzgKAyVJPJlHPIMHKcjQAB5CDQCAMBMHsAD5LnTEKZVQxikE-NjVFWAAGa5QPA48bLsNL7wY8dsu-XKCoEYjSNKucEIyqrsIDWrCp4uCyoQ4zxOkstlia8r+rIrScxGvr4xM8zLKgGy6iAA)

TypeBox includes a syntax engine that can transform TypeScript declarations into JSON Schema. The engine is a full syntactic frontend to Type.* and supports many advanced type-level constructs such as Conditional, Mapped, Indexed, Infer, Generics, Distributed types and more. This feature is implemented symmetrically at runtime and statically via TypeScript Template Literal types.

### Example

The following uses Script to parse TypeScript declarations into JSON Schema.

```typescript
// Namespace
const Math = Type.Script(`
  type Vector2 = { x: number, y: number }
  type Vector3 = Evaluate<Vector2 & { z: number }>
  type Vector4 = Evaluate<Vector3 & { w: number }>
`)

// Dependent Namespace
const { Mesh } = Type.Script({ ...Math }, `  
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

// Runtime Reflection
Mesh.properties.geometry.properties.vertices.items.properties.position.properties.x
Mesh.properties.geometry.properties.vertices.items.properties.normal.properties.x
Mesh.properties.geometry.properties.vertices.items.properties.uv.properties.x
Mesh.properties.material.properties.diffuse.properties.x
Mesh.properties.material.properties.ambient.properties.x
Mesh.properties.material.properties.specular.properties.x

// Static Inference
function render(mesh: Type.Static<typeof Mesh>) {
  mesh.geometry.vertices[0].position.x
  mesh.geometry.vertices[0].normal.x
  mesh.geometry.vertices[0].uv.x
  mesh.material.diffuse.x
  mesh.material.ambient.x
  mesh.material.specular.x
}
```

<a name="Schema"></a>

## Schema

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/schema/overview) | [Example 1](https://www.typescriptlang.org/play/#code/JYWwDg9gTgLgBAZQMYAsCmICGcBmUIhwDkMAnmGgEYQAeA9AM6oaZEBQbddcAtH-wMFDhI0WPESenbgGECYYABs003pPUbNW-hyQQAdg3gBVBmihwAvImZYAdHPBK0ACgDebOHDIUAXMQhKACs0JBgiABpPODB8ClhgNAZ-Dy8vYAATFO9yNH8iIyhgfQBzIjgAXyi0uH1MEDy4Nxy-YkLissrqtJYlbJ9Ggpgi0sjcaCwYfN7FcoroquioNABHAFdgZay4AG1oryJMsf3iOobjmqIZ9i8AXTYKgEoOLjVtd4+P1QAFTCgzVSfIHAyS6AxGOBrMwWaymcx2X7-VzNGqotHouCvPSGeBQ8wpaKZfIANgArDgAIyYABMlAAzEgACwZUloYk4ADsmAAHJQAJxIAAMGQpYwx6Ne6W27VK3TOgzxUDF4pVqq8ktq9UaMpK3Rm+UVAAEMgRMMU7HoQOU1SqNfq4DqHo8bS7XajXhUrHA7D6gA) | [Example 2](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAZQMYAsCmICGcBmUIhwDkMAnmGgEYQAeA9AM6oaZEBQokscAKuWrnyES-ajXZs6dOAFo58hYqXKVqteo0zJ0gMIEwwADZptszeYuWr8tmyQQAdg3gBVBmihwAvImZYAdHrgRmgAFHwU-gDylABWaEgwoQDebHBwwAAmAFy8-P4IMFDADgDmoQCUADRpcA6YIGi5EWgFRSXl1bUsRs35hcVlKbjQWDC5RD2GRHAAvhVs8wum1qtr61pScAAKmFDuKxtHx6q29k7wAK7unj5uHv67+2HJ6W-vH5-vW+fOcNceXKpdJZCYANgArDgAIyYABMlAAzEgACyZCFoME4ADsmAAHJQAJxIAAMmWhRCqX2pcC2IJycGcg1KNXS9UaEwBUEpNN5fO+0jZDSajPaZVZcCmnJuAAFMgRMCV-PYQDN+by6ZKsL1RczFhV1YajR8trNvHB-JagA)

TypeBox includes a high-performance JIT compiler that supports JSON Schema Draft 3 through to 2020-12. It is designed to be a lightweight industry-grade alternative to Ajv and offers improved compilation and validation performance. It also provides automatic fallback to dynamic validation in JIT restricted environments such as Cloudflare Workers.

The compiler is available via optional sub module import.

```typescript
import Schema from 'typebox/schema'
```

### Compile

The compiler accepts JSON Schema and returns Validator instances.

```typescript
const Vector = Schema.Compile(Type.Object({       // const Vector: Validator<TObject<{
  x: Type.Number(),                                //   x: TNumber
  y: Type.Number(),                                //   y: TNumber
  z: Type.Number()                                 //   z: TNumber
}))                                                // }>>
```
With JSON Schema
```typescript
const Vector = Schema.Compile({                    // const Vector: Validator<{
  type: 'object',                                  //   type: "object";
  required: ['x', 'y', 'z'],                       //   required: ["x", "y", "z"];
  properties: {                                    //   properties: { ... };
    x: { type: 'number' },                         // }, { ... }>
    y: { type: 'number' },
    z: { type: 'number' }
  }
})
```

### Validate

Validator instances provide functions to Check and Parse values.

```typescript
const Vector = Schema.Compile(Type.Script(`{
  x: number
  y: number
  z: number
}`))

const valid = Vector.Check({                       // const valid: boolean
  x: 1,
  y: 0,
  z: 0
}) 

const value = Vector.Parse({                       // const value: {      
  x: 1,                                            //   x: number
  y: 0,                                            //   y: number
  z: 0                                             //   z: number
})                                                 // }
```



### Coverage

The following table shows specification coverage implemented by TypeBox.

Ref: [JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) 

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
| dependencies | 17/18 | ✅ | ✅ | ✅ | - | - | - |
| dependentRequired | - | - | - | - | ✅ | ✅ | ✅ |
| dependentSchemas | - | - | - | - | ✅ | ✅ | ✅ |
| dynamicRef | - | - | - | - | - | 38/44 | 19/27 |
| enum | 14/16 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
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
| ref | 23/27 | 37/45 | 67/70 | 75/78 | 79/81 | 77/79 | 77/79 |
| required | 3/4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| type | 73/80 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| unevaluatedItems | - | - | - | - | ✅ | 65/71 | 64/71 |
| unevaluatedProperties | - | - | - | - | ✅ | ✅ | 124/125 |
| uniqueItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |


### Performance

The following table shows compile performance for various JSON Schema structures using AJV8 as a basis for comparison. 

```python
┌──────────────────────┬─────────────┬─────────────┐
│ Compile              │ TB1X        │ AJV8        │
├──────────────────────┼─────────────┼─────────────┤
│ Boolean              │ 29.2K ops/s │  7.1K ops/s │
│ Number               │ 34.5K ops/s │  7.6K ops/s │
│ String               │ 48.9K ops/s │  8.7K ops/s │
│ Null                 │ 39.6K ops/s │  7.6K ops/s │
│ Literal_String       │ 46.8K ops/s │  6.8K ops/s │
│ Literal_Number       │ 48.3K ops/s │  7.4K ops/s │
│ Literal_Boolean      │ 48.8K ops/s │  7.3K ops/s │
│ Pattern              │ 32.5K ops/s │  6.1K ops/s │
│ Object_Open          │  6.6K ops/s │  1.4K ops/s │
│ Object_Close         │  7.6K ops/s │    1K ops/s │
│ Object_Vector3       │ 20.8K ops/s │  2.8K ops/s │
│ Object_Basis3        │  7.5K ops/s │    1K ops/s │
│ Intersect_And        │   23K ops/s │  3.9K ops/s │
│ Intersect_Structural │  8.7K ops/s │  1.2K ops/s │
│ Union_Or             │ 17.9K ops/s │  3.4K ops/s │
│ Union_Structural     │ 11.3K ops/s │  2.1K ops/s │
│ Tuple_Values         │  9.6K ops/s │  2.1K ops/s │
│ Tuple_Objects        │  2.1K ops/s │   350 ops/s │
│ Array_Numbers_4      │ 33.6K ops/s │  4.2K ops/s │
│ Array_Numbers_8      │   39K ops/s │  3.7K ops/s │
│ Array_Numbers_16     │ 29.6K ops/s │  3.8K ops/s │
│ Array_Objects_Open   │  7.7K ops/s │   833 ops/s │
│ Array_Objects_Close  │  7.6K ops/s │   860 ops/s │
└──────────────────────┴─────────────┴─────────────┘
```


The following tables shows validation performance for various JSON Schema structures using AJV8 as a basis for comparison.

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