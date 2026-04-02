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

TypeBox is a runtime type system that creates in-memory JSON Schema objects that infer as TypeScript types. The schematics produced by this library are designed to match the static type checking rules of the TypeScript compiler. TypeBox offers a unified type system that can be statically checked by TypeScript and validated at runtime using standard JSON Schema.

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

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/type/overview) | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgYwgDsBneBOAXkSIDoB5YgK1Q0YACgDecSVOkzZAejlw6TFuzhjKksgC5OaLgDkAriGKooIgJQAaWXfvSFUwml14IAoTDzXNcJLrI+sam5la2DpEyTpJQqACORsBxACa6ANp4FLZ4SD74AF54ALq+kgWB3CFmFpZR9VIxcGDYaLDAqIy6GgC+dQ0DA01a3XAuqG70JjV4cD1lg4v1w-6j45PT5rPzfkt7disV6mNEG6FQ27v715JNPVc3+073lOOIakGoXADKMACGMGANAAPOMIBhEAA+IaKN6sDgaR6PJo6OBTc4LJFPRSSAJozZQTFYpZNI7omoPYkwuZAA)

TypeBox types are JSON Schema fragments that compose into more complex types. The library offers a set of types used to construct JSON Schema compliant schematics as well as a set of extended types used to model constructs native to the JavaScript language. The schematics produced by TypeBox can be passed directly to any JSON Schema compliant validator.

## Example

The following creates a User type and infers with Static.

```typescript
import Type from 'typebox'

// -------------------------------------------------------------------------------
// Type
// -------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------
// Static
// -------------------------------------------------------------------------------

type User = Type.Static<typeof User>              // type User = {
                                                  //   id: string,
                                                  //   name: string,
                                                  //   email: string
                                                  // }
```

## Script

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/script/overview) | [Example 1](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgFonmXW32POvueHb6AygGMowMDH6Ne0mbLnNqQiADsAzvADecAKqrUUADQ69UbWAAmAQxjoAvnAC8iIgDpho8QAoABtTjBlGygMSyF0AFFA4EI4DUo4f3MALjh1UWUAc3jbPwCgkLDjfThUMhtlc1U4SJhopFi4eITlSxBUFLSAjKMmkpBLYAAbDph0jMa4HPjCNCLTC2t0J3CAN0tBgFdFgB5egAVgIQBrbd19IyPUJAgMaqjCAD44ADIJhL3LWGB17YB5EGipxMFyuNzutUeD3iUO8AEpqHQpPJkSiUZIAEqoDCDVBCCSI1GEom8RQqVQQHEuQYQDKeM5QWEJJnMlmstksxFxdncnm83mIhIzdr4CDEABWuJgeAMvT5cvlbIFcDA2DQX1QqhSXIVOt1SoSwGSDSFKTwnUyeEmMt1Nvl+rgLTaWrgJvw5oylts1ttPu59tQ-SGztdZtGXU9st9UYSSq9kejvqVUFQAEcNsBk0aANrxhO2+14Q3St55qMFx2oYu50s6gsBgaDKg1sv0BIAXWrzbliKmSjUFNQVJpdJMZisNkZec5na7-NbLqIptFErx0pns7985VEDVtQ1WvXG8V84NRq0Ifdnu9R4V9orwcXbrDFqth5vzP9geGxsfobGEffW95zjQC7XnZM0wzVBs0Lcw8A7UDu3oKYCWJND0IUREBBgaxDkkDCCOJaghTmRxnDQNwcNqIRtiFMF6SeJCF1mekyO1RC5yZQ0RjGa8OM3Jl71SZ9ujfRClXrINhLGMTQJ7YiiDmMdFjI5AKOw3CaLo256WUmxGMREjdIWGw2NkwClW46Suj4-jj0E1pUAAfh4mzzPfCSvxc6zMncm95KAA) | [Example 2](https://www.typescriptlang.org/play/#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgFonmXW32POvnb7k1ejbsJGj21AMYQAdgGd4AUWkxghOAF5ERAHQB5YgCtUEmAAoA3pThxgAEwBcWtNoDKMKMGkBzUwEpKAL7+lFJy8ACqsqhQGk6o2gCSytEYAIYSqKYA2koqhAC6ADRwltbSqSCojvzxbh7efoVWcKggqcAANtU6dZ4+-kGSMvJwkdHhYLapMOiaNdoKAG6pHQCu05nzSTNQUSbZzfMACsASANamY1DF8wDSqEi6GKa5qki+vk3Wx6mwwCumea6ECqS5Ra5xbT3R7PV6ED7+fIfah0IRidEYzHcQQAJVQGA6xhggixpLJWKGcgghO0HQgPiuvmszJZrLZ7NZqNKHJ5vL5vNR1kIaEceAghiJeC+-Jlsp5grgYGwaD+qFkjm5cq1WoV1jsGrgwqq+Hk9S8eDgAWl2pt-N1cHKlQNRtFpr6FqtzVt3o59ta7S6JUNRFd7ndlq9PqjzIVnuj8esCqgqAAjqtgMmHHAspGE977Xg7FK4Lm8zaC47UMXS2WdfQWXh-Z0qLWfQr8jXWzLUQFKbJqfE6QzwRMpjMmQmuZ2u3yFS78OKjCYpdOZ-L64rldEVGqNau1+z7fqg-O8G7vB7rQfuxuyhVjeZgyKTWGL5ar9fZ7eWm1Os6Qy+Zoevun4xhucagXaG7JmmGaoFmWSFrYeAdpBUERiS5JYdhnCCG40ynJhOHEcR1BGqM4KxPM+EqBIAA8RoQBgFHRAAfLKqLkVcsSamh67Mse55eB+fFsgqlaOEJImiSyCpNoGQkgWhPZkUQLFQKOGxUT0MAEfRjHMVcmkzOxcCcWpRmTFpmi8TJnIboJr7CUpkHifeAD8klOdJdlmRu8meXAim+Ye9ABEAA)

TypeBox can transform TypeScript definitions into JSON Schema. The Script function provides an optional programmatic syntax to rapidly convert type definitions into JSON Schema, or serve more generally as an alternative to Type.* builders. The Script function is designed to handle a wide array of complex TypeScript type-level expressions.

### Example

The following uses the Script to parse interfaces into JSON Schema.

```typescript
import Type from 'typebox'

// -------------------------------------------------------------------------------
// Script
// -------------------------------------------------------------------------------

const { User, UserUpdate } = Type.Script(`

 interface Entity {
  id: string
 }

 interface User extends Entity { 
   name: string, 
   email: string 
 }

 type UserUpdate = Evaluate<
   Pick<User, keyof Entity> & 
   Partial<Omit<User, keyof Entity>>
 >
`)

// -------------------------------------------------------------------------------
// Reflect
// -------------------------------------------------------------------------------

console.log(User)                                // {
                                                 //   type: 'object',
                                                 //   properties: {
                                                 //     id: { type: 'string' },
                                                 //     name: { type: 'string' },
                                                 //     email: { type: 'string' }
                                                 //   },
                                                 //   required: [
                                                 //     'id', 
                                                 //     'name', 
                                                 //     'email'
                                                 //   ]
                                                 // }

console.log(UserUpdate)                          // {
                                                 //   type: 'object',
                                                 //   properties: {
                                                 //     id: { type: 'string' },
                                                 //     name: { type: 'string' },
                                                 //     email: { type: 'string' }
                                                 //   },
                                                 //   required: ['id']
                                                 // }

// -------------------------------------------------------------------------------
// Static
// -------------------------------------------------------------------------------

type User = Type.Static<typeof User>              // type User = {
                                                  //   id: string,
                                                  //   name: string,
                                                  //   email: string
                                                  // }

type UserUpdate = Type.Static<typeof UserUpdate>  // type UserUpdate = {
                                                  //   id: string,
                                                  //   name?: string,
                                                  //   email?: string
                                                  // }

```

<a name="Schema"></a>

## Schema

[Documentation](https://sinclairzx81.github.io/typebox/#/docs/schema/overview) | [Example 1](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAZQMYAsCmICGcBmUIhwDkMAnmGgEYQAeA9AM6oaZEBQokscAKuWrnyES-ajXZs6dOAFo58hYqXKVqteo0zJ0gMIEwwADZptszeYuWr8tmyQQAdg3gBVBmihwAvImZYAdHrgRmgAFHwU-gDylABWaEgwoQDebHBwwAAmAFy8-P4IMFDADgDmoQCUADRpcA6YIGi5EWgFRSXl1bUsRs35hcVlKbjQWDC5RD2GRHAAvhVs8wu2K6tSZtabW1umAAqYUO6m2yenmrb2TvAAru6ePm4e-vuHYcnpH59f35-rl85wW4eXKpdJZCYANgArDgAIyYABMlAAzEgACyZKFoCE4ADsmAAHJQAJxIAAMmVhRCqP1pcHWYJycGcg1KNXS9UaEyBUGpdP5At+0g5DSazPaZXZcCm3LuAAFMgRMCV-PYQDNBfyGdKsL1xazFhVNcaTV91rNvHB-NagA) | [Example 2](https://www.typescriptlang.org/play/#code/JYWwDg9gTgLgBAZQMYAsCmICGcBmUIhwDkMAnmGgEYQAeA9AM6oaZEBQbddcAtH-wMFDhI0WPESenbgGECYYABs003pPUbNW-hyQQAdg3gBVBmihwAvImZYAdHPBK0ACgDebOHDIUAXMQhKACs0JBgiABpPODB8ClhgNAZ-Dy8vYAATFO9yNH8iIyhgfQBzIjgAXyi0uH1MEDy4Nxy-YkLissrqtJYlbJ9Ggpgi0vKK6KroqDQARwBXYGmsuABtaK8iTMi4deI6hu3dol7Fdi8AXTYKgEoOLjVtR6en1QAFTCgzVWef38ldAxGOBzMwWaymcx2d6fVzNGrwhGIuD3PSGeAg8wpaKZfIANgArDgAIyYABMlAAzEgACwZfFoXE4ADsmAAHJQAJxIAAMGSJ2yRiPu6WW7VK3X2gwxUAFgrl8q8wtq9UaYpK3RO+WlAAEMgRMMU7HoQOUFXKlZq4GqrtczXb7fD7hUrHA7G6gA)

TypeBox includes high performance validation compiler for JSON Schema Drafts 3 through to 2020-12. The compiler supports both TypeBox and JSON Schema, and will convert schematics into high performance validation routines. The compiler is designed to be a lightweight spec compliant alternative to Ajv for high-throughput applications.

### Example

The following uses the Schema submodule to compile a TypeBox type.

```typescript
import Schema from 'typebox/schema'

// -------------------------------------------------------------------------------
// Compile
// -------------------------------------------------------------------------------

const User = Schema.Compile(Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String({ format: 'email' })
}))

// -------------------------------------------------------------------------------
// Parse
// -------------------------------------------------------------------------------

const user = User.Parse({                        // const user: {
  id: '65f1a2b3c4d5e6f7a8b9c0d1',                //   id: string,
  name: 'user',                                  //   name: string,
  email: 'user@domain.com'                       //   email: string
})                                               // } = ...
```

<a name="Versions"></a>

## Versions

TypeBox provides two distinct versions that span two generations of the TypeScript compiler.

| Version | TypeScript | Description |
| :--- | :--- | :--- |
| **1.x** | **6.0 - 7.0+** | **Latest.** Developed against the TypeScript 7 native compiler. Provides advanced type inference and native JSON Schema 2020-12 support. Includes backwards compatibility with `0.x` types. **ESM only.** |
| **0.x** | **5.0 - 6.0** | **LTS.** Developed against older TypeScript versions and actively maintained under Long Term Support. Compatible with both **ESM and CJS**. Issues should be submitted to the [Sinclair TypeBox](https://github.com/sinclairzx81/sinclair-typebox) repository. |

## Contribute

TypeBox is open to community contribution. Please ensure you submit an issue before submitting a pull request. The TypeBox project prefers open community discussion before accepting new features.