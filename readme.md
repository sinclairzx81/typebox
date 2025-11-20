<div align='center'>

<h1>TypeBox</h1>

<p>Json Schema Type Builder with Static Type Resolution for TypeScript</p>

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

TypeBox is a runtime type system that creates in-memory Json Schema objects that infer as TypeScript types. The schematics produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type system that can be statically checked by TypeScript and validated at runtime using standard Json Schema.

This library is designed to allow Json Schema to compose similar to how types compose within TypeScript's type system. It can be used as a simple tool to build up complex schematics or integrated into REST and RPC services to help validate data received over the wire.

License: MIT

## Contents

- [Upgrade](#Upgrade)
- [Type](#Type)
- [Value](#Value)
- [Compile](#Compile)
- [Schema](#Schema)
- [Script](#Script)
- [Contribute](#Contribute)

## Upgrade

If upgrading from `@sinclair/typebox` refer to the 1.0 migration guide at the following URL.

[Migration Guide](https://github.com/sinclairzx81/typebox/blob/main/changelog/1.0.0-migration.md)

<a name="Type"></a>

## Type

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/type/overview) | [Example](https://www.typescriptlang.org/play/#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgYwgDsBneBOAXkSIDoB5YgK1Q0YACgDecSVOkzZcuAHoFcOkxbs4YypLIAuTmi4A5AK4hiqKCICUAGnkPHspVMJp9eCAKEw8t7XBI+siGpuaWNvZO0Q4uklCoAI4mwAkAJvoA2ngU9nhIfvgAXngAuv6SRcHcYRZW1jGNcnFwYNhosMCojPpaAL4NTUPDisrSeppwbqge9GZ1eHB9FSOrjS2SQZPTs-OWi8sBa8exY1JV20S74VAHRycP0i1994+PLi+U04gaIahcAGUYABDGDAGgAHmmEAwiAAfCcXN9WBwtG90aMpBM5jcVhiHi0tji6nj8ccWhdiZZXmSRh8gA)

TypeBox includes many functions to create Json Schema types. Each function returns a small Json Schema fragment that corresponds to a TypeScript type. TypeBox uses function composition to combine schema fragments into more complex types. It provides a set of functions that are used to model Json Schema schematics as well as a set of functions that model constructs native to JavaScript and TypeScript.

## Example

The following creates a Json Schema type and infers with Static.

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
const T = Type.String({                            // const T = {
  format: 'email'                                  //   type: 'string',
})                                                 //   format: 'email'
                                                   // }

const S = Type.Number({                            // const S = {
  minimum: 0,                                      //   type: 'number',
  maximum: 100                                     //   minimum: 0,
})                                                 //   maximum: 100
                                                   // }

```

<a name="Value"></a>

## Value

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/value/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBANQIYBsCuBTOAzKERwDkMAnmBgEYQAeA9AG6qaEBQokscAKmVrvkVLkq1ViwDGEAHYBneFzgBebrwB0AeQoArDOJgAKAN4s4cagC4V5VQDk0IChij6AlABoTcEpZ7W7Dp1cPUwAvHzV-R2cXFgBfGIlpOTgAQSVEJgxVAAUkKBkMfS43OENTcorKqqraWjhJWXgUy2NTCzgARhLqnt6+vtry9ql7KOCvSwAGbv7ZuerB0284EYCocbC4Sfmd3bhFuE3VqLiXPfOdwdj01VugA)

The Value module provides functions that perform typed operations on JavaScript values. It includes functions such as Check, Parse, Clone, Encode, Decode and as well as advanced functions to perform structural Diff and Patch on dynamic JavaScript values.

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


<a name="Compile"></a>

## Compile

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/compile/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIYBPMLAIwgA8B6AYzTEy1IChRJY4AKlRxES5YXXrcurAHYBneMjgBeFGw4AKIdQB0AeRoArLMxiakcK9Zu3bjRnDmKUALjgA1AIYZgAEy8YaAAeBFwAGkFDEzNQrit6dx0sXQA5AFcQGiwoTQBKSLsi4pKrB2tEwQysnPD4uAok4TTM7NyC0s6u8qtGqtba+oAvJr1qtvyuqZKeuBH+mqguXDy86fWNm3LcAD4drhkIBXgAQVUUXQAFLyh5LAtNjfLnU-cEesqABkLH37tZyqyAZQOq9dwARh+f2hcFmfSBi1Bc3cnxhaNhjis8wRbWWa3RBO2510JKAA)

The Compile module is a high-performance JIT compiler that transforms types into efficient runtime validators. The compiler is optimized for both fast compilation and validation.

```typescript
import { Compile } from 'typebox/compile' 
```

### Example

The following uses the compiler to Compile and Parse a value. 

```typescript
const C = Compile(Type.Object({                     // const C: Validator<{}, TObject<{
  x: Type.Number(),                                 //   x: TNumber,
  y: Type.Number(),                                 //   y: TNumber,
  z: Type.Number()                                  //   z: TNumber
}))                                                 // }>>

const A = C.Parse({                                 // const A: {
  x: 0,                                             //   x: number,
  y: 1,                                             //   y: number,
  z: 0                                              //   z: number
})                                                  // } = ...
```

<a name="Schema"></a>

## Schema

[Example 1](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIYBPMLAIwgA8B6AYzTEy1ICgfWA7AM7xkcALwo2HABQIucOJWoAuMhBoArLMxikANHLhQsARwCuwIwBMVAbVL09ZCo9IAvUgF198sMWqxgLAEVWXl5ehCFKiwVUj5TEBosKFI8bzCKSMUYsnjE5NTcdPlXLOjYvKSUvANcLlwASl4IQXgAQTEUADoABQBDKAEsGTDRsfGJycZGOH4hODaQgwi4AAZdSc2t7YnpsJXK5PTMtY2d84uxvfkTw6h00rgARkvXy+u4R7v6hre-95m+HEXRBQA) | [Example 2](https://tsplay.dev/mxrl7w)

TypeBox is built upon a high-performance validation infrastructure that supports the direct compilation and inference of Json Schema schematics. TypeBox implements Draft 3 to 2020-12 and is compliance tested via the official Json Schema [Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite). It offers high-performance JIT compilation with automatic fallback to dynamic checking in JIT restricted environments.

### Example

The following compiles Json Schema. Type inference is supported.

```typescript
const C = Compile({
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
})

const A = C.Parse({                                 // const A: {
  x: 0,                                             //   x: number,
  y: 0,                                             //   y: number,
  z: 1                                              //   z: number
})                                                  // } = ...
```

It can also be used to accelerate remote libraries via Json Schema translation.

```typescript
const C = Compile(x.toJsonSchema(x.object({
  x: x.number(),
  y: x.number(),
  z: x.number()
})))

const A = C.Check(...)                              // high performance runtime checking
```

## Script

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/script/overview) | [Example 1](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgGUBjKYMGVAE0SOqYgB2AZ3gI4AXh5oAdM1bsAFAAMA3nEpw4ZAFxwBAVxDFUUADTrNSXSNYCA5uY1wAXrtIQANqgCGA9QF8lAEpNULDwiMio6PC6OH5hUV0EAHliACtUJhgAHhUnGMKi4rC4zR1EADlDYzMCkobG0vpLZIYYWwd6pp7ispdkgCEITx8Bbt7JqLj-AD5qOIApIUFGJgALVBBvOABJAQ6IITRs4EFqBGlCNCnb0Li8CAysmCpLqFQAR31gD+47npxADaeAo5jwSDw4OceAAupRLmBsGhYMBUEIAY04moKtI8eYrHA8dJzK4iXi4P4FvQ5GwONxkDcFABhHBgfT0oJ8QQiRgSKSoWQsOkKNRifzmVROIEAaTgwD8AGtUEgIBhELDkrLYXAAD56fQeDyUQIhTF3OIJXkMZJpTLZPITc2TfoVBAAVQEZwEOSBCGqRhM5n9ho8sNmpidzsBLTghI9XsEvoQ7U6weqRvDkejAP6ZIT3uTw1GvnTofDUZzDRm81oNJgvk43ig3H2GBMqAETFQ1Gu6AY-MZgva3hgwCYOT7asYs1ucT7fMk+Src9jFQMgageoNRuzK5dscJNgVdm3Bl3lf3hTzbhGXl8Z9Dl6v0RmQA) | [Example 2](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgAkIA3VKOGAC1QGd0NocYADsMbVMIDG6ABQ9OEAK4AbACZwQAQxiTOHbnB6SowMDFTrCaAJSVUZSLA5E4AMQgQ4AXkREAdADKMNrAkgA8VqgQGG4eAHx2DtDwkXAAQprsPshogcEwoRFE0emZCbT0AMIQYEhwmsLqYJo85ogBzmg8QsIwnjmogcamMDJ+49b1jXAA5qjwxJqSANadqAC0PJpicABSAQDyAHJwAbqoWomO8JIQwq1wAN6xEAA0pewAvt6+uWcmZhkAANKKl3J4fI9KHA4GQAFxwYSKEDENjQuBIBFIlFomEALyxyNRUEon2oqQyWSe6KgqE0qjuyjqAG0ANI9ODLVBIErg+rdACymjAYVZcQAugiAIKqZgNaSqUVxOAAHxebPFpPJLhlcqkFlF3PeADVMsAGjBuj48AANPCq-AATXtarwAC08MqfDJ0QAdIG+gAkjwAqmA0FBJC1UIakHFPkHHqaTBaeJ91qBIDweMBiMpUP7KLZQS4hSLWdyvXAwxGo3wwuiK3V7OZGt08BQ4AB+fCae1wxvcuAtiSqdtIe09vDEfuD5tkVtj-B4yf4SSzmHCVCsEnlIG2OhwA6KGBgE9rbqZfgqJlwWkYfOSYJ59D7Y6nc6XcF+VIwv---9DzwCBiAAK1QJ97TgShvzAbAIwKXgAL-Q9nnhOBxj8d5MQw8Z3gJXC-DgMlv1pABHRRgFpdRkJQ+hmQ7PB3jwCdmJXcUgA)

TypeBox includes a TypeScript scripting engine able to parse TypeScript types directly into Json Schema. The engine uses symmetric runtime and type-level parsing and returns typed safe schematics from TypeScript types (including computed types). The engine is designed for TypeScript 7 native compiler but is supported in TypeScript 5 and above.

```typescript
// Scripted Type

const T = Type.Script(`{ 
  x: number, 
  y: string, 
  z: boolean 
}`)                                                 // const T: TObject<{
                                                    //   x: TNumber,
                                                    //   y: TString,
                                                    //   z: TBoolean
                                                    // }>

// Json Schema Introspection

T.type                                              // 'object'
T.required                                          // ['x', 'y', 'z']
T.properties                                        // { x: ..., y: ..., z: ... }

// Scripted Type (Computed)

const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)                                                 // const S: TObject<{
                                                    //   x: TUnion<[TNumber, TNull]>,
                                                    //   y: TUnion<[TString, TNull]>,
                                                    //   z: TUnion<[TBoolean, TNull]>
                                                    // }>

// Standard Inference

type S = Type.Static<typeof S>                      // type S = {
                                                    //   x: number | null,
                                                    //   y: string | null,
                                                    //   z: boolean | null
                                                    // }
```


## Contribute

TypeBox is open to community contribution. Please ensure you submit an issue before submitting a pull request. The TypeBox project prefers open community discussion before accepting new features.