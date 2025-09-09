<div align='center'>

<h1>TypeBox</h1>

<p>A Runtime Type System for JavaScript</p>

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
$ npm install typebox --save                        # 1.0.0

$ npm install @sinclair/typebox --save              # 0.34.x
```

## Usage

```typescript
import Type, { type Static } from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number(),                                 //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```

## Overview

TypeBox is a runtime type system that creates in-memory Json Schema objects that infer as TypeScript types. The schemas produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type that can be statically checked by TypeScript and runtime checked with Json Schema.

TypeBox is designed to bring TypeScript level programmability to Json Schema. It is also designed to be a high performance validation solution for JavaScript. It can be used as a simple tool to build up complex schema or integrated into REST and RPC services to help validate data received over the wire.

License MIT

## Contents

- [Docs](#Docs)
- [Type](#Type)
- [Script](#Script)
- [Value](#Value)
- [Compile](#Compile)
- [Contribute](#Contribute)

<a name="Documentation"></a>

## Docs

Full documentation for TypeBox can be found on the website.

[Documentation](https://sinclairzx81.github.io/typebox/)

<a name="Type"></a>

## Type

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/type/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKYBo4G84xauAZRgEMZgBjOAXzgDMoIQ4ByPNAIwgA8WAoPhQgA7AM7wEcALyJ8AOgDyHAFaoKMABQ44O3Xv0HDAeiNwhYidOx8d3AFyy0cgHIBXEB1RQNASkyGAwICTXXZUBxYIFTUYFnQbOCQHZCc3Dy9ffyDsoJCdKFQAR1dgAoATBwBtFl5MFiQ41gAvFgBdeJ0m5Pk0z28fHMHAvLgwRjRYYFRRByw+agGhpeW9EdtZ3HwI4Xc+lhoOlaPltcSNsO3dr33qQ+P77NOu7E20S-SoG4SHn+NTHWo31+wJ0IUBfDCiCsxDIlAAPGEIHREAA+EGg0yQyQyObo9EjexwHYfO54n4jJJEq5QUlk+4jZ7EvpAunHMFAA)

TypeBox provides many functions to build Json Schema. Each function returns a small Json Schema fragment which maps to a corresponding TypeScript type. TypeBox uses function composition to compose schema fragments into higher order types. TypeBox provides a set of types to model Json Schema schematics. It also offers a set of extended schematics to model constructs native to TypeScript and JavaScript.

## Example

The following creates Json Schema and infers with Static.

```typescript
import Type, { type Static } from 'typebox'

const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```



<a name="Script"></a>

## Script

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/script/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKYBo4G84xauAZRgEMZgBjOAXzgDMoIQ4ByPNAIwgA8WAoPhQgA7AM7wEcALyJ8AOkIUowMDAAUAAxx84cbgC44wgK4gOqKJh1wkhk2YtXdALzunzUOH2oaAlLoDAoOCQ0LCggHoIuCExCWlEAHkOACtUChgAHixrcLz8gsCogINEADl3R1zCmtqi6N1bcsrLarr2guKXQwQKhyg2jqHQ4uoAPgFY8SIE5DQFJRV1HElqTC1rAG0AaThgYTgAa1QkCDpEAF0enYu4AB8jYwAbJ+8-YY-g4qn4Qh7ktIZbKDT6fLp6HoAVWEwBEmU2vRamERLwuY3QINBw3BTQQ0NhwnhiP6yIqqPRmKxHXBrkQ+LhCL6HlJzyeaMpVLqowmfHYBEICWIZEomT5ZyIY05xT5MxkOU5WPBpXsHnujxeGIVoJxbn6apMGo5Ws6DTgtJVFn1rKNxryowEfCAA)

TypeBox is a type engine that uses Json Schema as a portable AST for runtime type representation. The Script function provides a syntax DSL to the engine and enables Json Schema to be created using native TypeScript syntax. This engine supports full type-safety for string encoded types.

### Example

The following uses Script to create and map types.

```typescript
import Type, { type Static } from 'typebox'

const T = Type.Script(`{ 
  x: number, 
  y: number, 
  z: number 
}`)                                                 // const T = TObject<{
                                                    //   x: TNumber,
                                                    //   y: TNumber,
                                                    //   z: TNumber
                                                    // }>

const S = Type.Script({ T }, `{
  [K in keyof T]: T[K] | null
}`)                                                 // const S: TObject<{
                                                    //   x: TUnion<[TNumber, TNull]>,
                                                    //   y: TUnion<[TNumber, TNull]>,
                                                    //   z: TUnion<[TNumber, TNull]>
                                                    // }>

type S = Static<typeof S>                           // type S = {
                                                    //   x: number | null,
                                                    //   y: number | null,
                                                    //   z: number | null
                                                    // }
```

<a name="Value"></a>

## Value

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/value/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoUSWOANQEMAbAV3Sx30LVLIHoAbi3ZVKAYwgA7AM7wEcALyIiAOgDyxAFapxMABQBvSnDhkAXCrSqAcqxDFUUfQEoANCbhJLya3YdOrh6mAF4+av6Ozi6UAL4xlPz8cADCABa6ANaUEtJycACCSgwiqKrpWfoIbnCGpvUNjU1NSXCSsvAFlqQQzKiMUsUwUOyeFnAAjDXNM7Nzs57ecABMwXBhcADMcQmtAAqMUDKoOe35AELFTGxlB0eoVTV18y+mrWfw55bGpuNTrwDAfVWr9LFJ7FE1ktVkDYS8QV4wRCnGsNps4RjZgiNuCAlAdpjCVjkrFiqpyUA)

The Value module provides functions to Check and Parse JavaScript values. This module also includes functions that perform structural operations values such as Clone, Repair, Encode, Decode, Diff, Patch and Hash. This module has support for Json Schema and Standard Schema.

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

The Compile module provides functions to transform types into high-performance validators. The compiler is tuned for fast compilation as well as validation. The compiler can accept both Json Schema and Standard Schema schematics however compiler optimizations are limited to Json Schema only.

The compiler is available via optional import.

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