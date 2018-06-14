# typebox

A type system in a box + json schema

```typescript
import { Type, Static } from "./typebox"

// type Foo = {
//   a: string,
//   b: number,
//   c: boolean
// }
const Foo = Type.Object({
  a: Type.String(),
  b: Type.Number(),
  c: Type.Boolean()
})

// statically resolve types
const foo: Static<typeof Foo> = { a: "hello", b: 2, c: true }

console.log(Foo)
// -> { type: 'object',
//     properties: 
//      { a: { type: 'string' },
//        b: { type: 'number' },
//        c: { type: 'boolean' } },
//     required: [ 'a', 'b', 'c' ] }
```

## overview

typebox is a type builder library which allows developers to compose json schema objects and allow these json schema objects to be statically resolved as TypeScript types. The aim of this project is to find parity with respect to the TypeScript type checker and JSON schema, allowing for runtime type verification using standard json schema validation that lines up to TypeScripts structural type checker.

note: typebox doesn't is only concerned with generating valid JSON schema and static resolution and does not come with a JSON schema validator. For JSON schema validation, recommend the `ajv` library for JavaScript.

## usage

typebox is written as a portable single file that can be copied into any typescript project. Copy the `./src/typebox.ts` file into your project and you're all setup.

```typescript
import { Type, Static } from "./typebox"

const TString = Type.String()

// resolve as type
type String = Static<typeof TString>

// as an argument
const f = (s: Static<typeof TString>) => { /* ... */ }

// and so on...
```

## typebox > typescript

The following are the typebox to typescript mappings.

type        | typbox                                                       | typescript
---         | ---                                                          | --- 
Any         | `const T = Type.Any()`                                       | `type T = any`                  |
Null        | `const T = Type.Null()`                                      | `type T = null`                 |
Number      | `const T = Type.Number()`                                    | `type T = number`               |
String      | `const T = Type.String()`                                    | `type T = string`               |
Boolean     | `const T = Type.Boolean()`                                   | `type T = boolean`              |
Object      | `const T = Type.Object({ name: Type.String() })`             | `type T = {name: string}`       |
Array       | `const T = Type.Array(Type.Object({ name: Type.String() }))` | `type T = {name: string}[]`     |
Enum        | `const T = Type.Enum("yes", "no")`                           | `type T = "yes" | "no"`         |
Tuple       | `const T = Type.Tuple(Type.String(), Type.Number())`         | `type T = [string, number]`     |
Union       | `const T = Type.Union(Type.String(), Type.Number())`         | `type T = string | number`      |
Intersect   | `const T = Type.Intersect(Type.String(), Type.Number())`     | `type T = string & number`      |
Literal     | `const T = Type.Literal("click")`                            | `type T = "click"`              |
Pattern     | `const T = Type.Pattern(/foo/)`                              | `type T = string`               |
Range       | `const T = Type.Range(0, 100)`                               | `type T = number`               |

## typebox > json schema

The following are the typebox to json schema mappings.

type        | typbox                                                       | json schema
---         | ---                                                          | --- 
Any         | `const T = Type.Any()`                                       | `{ }`                  |
Null        | `const T = Type.Null()`                                      | `{ type: "null" }`                 |
Number      | `const T = Type.Number()`                                    | `{ type: "number" }`               |
String      | `const T = Type.String()`                                    | `{ type: "string" }`               |
Boolean     | `const T = Type.Boolean()`                                   | `{ type: "boolean" }`              |
Object      | `const T = Type.Object({ name: Type.String() })`             | `{ type: "object": properties: { name: { type: "string" }} }`       |
Array       | `const T = Type.Array(Type.Object({ name: Type.String() }))` | `{ type: "array": items: { type: "object": properties: { name: { type: "string" }} } }` |
Enum        | `const T = Type.Enum("yes", "no")`                           | `{ type: "string", enum: ["yes", "no"] }`         |
Tuple       | `const T = Type.Tuple(Type.String(), Type.Number())`         | `{ type: "array", items: [{type: "string"}, {type: "number"}], additionalItems: false, minItems: 2, maxItems: 2 }`     |
Union       | `const T = Type.Union(Type.String(), Type.Number())`         | `{ anyOf: [{ type: "string"}, {type: "number"}] }`      |
Intersect   | `const T = Type.Intersect(Type.String(), Type.Number())`     | `{ allOf: [{ type: "string"}, {type: "number"}] }`      |
Literal     | `const T = Type.Literal("click")`                            | `{ type: "string", enum: ["click"] }`              |
Pattern     | `const T = Type.Pattern(/foo/)`                              | `{ type: "string", pattern: "foo" }`               |
Range       | `const T = Type.Range(0, 100)`                               | `{ type: "number", minimum: 0, maximum: 100 }`    |

