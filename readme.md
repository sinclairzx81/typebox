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

Options and constraints can be passed on the last argument of any given type.

```typescript
const T = Type.Number({                            // const T = {
  minimum: 0,                                      //   type: 'number',
  maximum: 100                                     //   minimum: 0,
})                                                 //   maximum: 100
                                                   // }

const S = Type.String({                            // const S = {
  format: 'email'                                  //   type: 'string',
})                                                 //   format: 'email'
                                                   // }
```

<a name="Value"></a>

## Value

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/value/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoUSWOANQEMAbAV3Sx30LVLIHoAbi3ZVKAYwgA7AM7wEcALyIiAOgDyxAFapxMABQBvSnDhkAXCrSqAcqxDFUUfQEoANCbhJLya3YdOrh6mAF4+av6Ozi6UAL4xlPz8cADCABa6ANaUEtJycACCSgwiqKrpWfoIbnCGpvUNjU1NSXCSsvAFlqQQzKiMUsUwUOyeFnAAjDXNM7Nzs57ecABMwXBhcADMcQmtAAqMUDKoOe35AELFTGxlB0eoVTV18y+mrWfw55bGpuNTrwDAfVWr9LFJ7FE1ktVkDYS8QV4wRCnGsNps4RjZgiNuCAlAdpjCVjkrFiqpyUA)

The TypeBox Value module provides functions to Check and Parse JavaScript values. It also includes functions such as Clone, Repair, Encode, Decode, Diff and Patch which perform various structural operations on JavaScript values.

The Value module is available via optional import.

```typescript
import Value from 'typebox/value'
```

### Example

The following uses the Value module to Check and Parse a value. 

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

// Check

const A = Value.Check(T, {                          // const A: boolean = true
  x: 1,                                            
  y: 2,
  z: 3
})

// Parse

const B = Value.Parse(T, {                          // const B: {
  x: 1,                                             //   x: number,
  y: 2,                                             //   y: number,
  z: 3                                              //   z: number
})                                                  // } = ...
```


<a name="Compile"></a>

## Compile

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/compile/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIYBPMLAIwgA8B6AYzTEy1IChRJY4AKlRxES5YXXrcurAHYBneMjgBeFGw4AKIdQB0AeRoArLMxiakcK9Zu3bjRnDmKUALjgA1AIYZgAEy8YaAAeBFwAGkFDEzNQrit6dx0sXQA5AFcQGiwoTQBKSLsi4pKrB2tEwQysnPD4uAok4TTM7NyC0s6u8qtGqtba+oAvJr1qtvyuqZKeuBH+mqguXDy86fWNm3LcAD4dri5y5AALUwBrA+d4AEFVFF0T84tNjfKruGv3OghsL1k7mBQdJYeqVACMhReUNs9T6ACY6lZ5gBmZZ5A7lAAKXig8hBMggCngACE7shdNjcVhntDuo53sT3AhQe4IbT2WVHAl3LIBlBEQ13AiOezZn1eYsBSiRaKuXMeXy0TKZds7rp1UA)

The TypeBox Compile module provides functions to convert types into high-performance validators. The compiler is tuned for fast compilation as well as fast validation.

The Compile module is available via optional import.

```typescript
import { Compile } from 'typebox/compile' 
```

### Example

The following uses the Compile module to Check and Parse a value. 

```typescript
const C = Compile(Type.Object({                     // const C: Validator<{}, TObject<{
  x: Type.Number(),                                 //   x: TNumber,
  y: Type.Number(),                                 //   y: TNumber,
  z: Type.Number()                                  //   z: TNumber
}))                                                 // }>>

// Check

const A = C.Check({                                 // const A: boolean = true
  x: 1,                                            
  y: 2,
  z: 3
})

// Parse

const B = C.Parse({                                 // const B: {
  x: 1,                                             //   x: number,
  y: 2,                                             //   y: number,
  z: 3                                              //   z: number
})                                                  // } = ...
```

## Contribute

TypeBox is open to community contribution. Please ensure you submit an issue before submitting a pull request. The TypeBox project prefers open community discussion before accepting new features.