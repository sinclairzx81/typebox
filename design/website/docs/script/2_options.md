# Script.Options

Annotations and data can be assigned to Script types in several ways.

## Options\<Type, Json\>

Script provides a specialized `Options<Type, Json>` generic type. This type is available to both `Type.*` and Script via a generic call. `Options<Type, Json>` is designed to allow type definitions to be shared between TypeScript and TypeBox, while also allowing options and annotations to be assigned to embedded Script types.

### Type Sharing

`Options<Type, Json>` enables definitions to be shared between TypeScript and TypeBox scripting environments.

```typescript
// Add this to a TypeScript Module
type Options <Type, _> = Type 

// Type Is Now Sharable Between TypeBox and TypeScript
type Vector = Options<{
  x: Options<number, { minimum: 0, maximum: 1 }>,
  y: Options<number, { minimum: 0, maximum: 1 }>,
}, { additionalProperties: false }>
```

### Usage

The following shows the usage of `Options<Type, Json>`.

```typescript
// ----------------------------------------------------------------------------
// Options 
// ----------------------------------------------------------------------------
const VectorA = Type.Options(Type.Object({
  x: Type.Options(Type.Number(), { minimum: 0, maximum: 1 }),
  y: Type.Options(Type.Number(), { minimum: 0, maximum: 1 })
}), { additionalProperties: false })

// ----------------------------------------------------------------------------
// Options via Script
// ----------------------------------------------------------------------------
const VectorB = Type.Script(`Options<{
  x: Options<number, { minimum: 0, maximum: 1 }>,
  y: Options<number, { minimum: 0, maximum: 1 }>,
}, { additionalProperties: false }>`)

// ----------------------------------------------------------------------------
// Options via With Keyword (Experimental)
//
// TypeBox provides an experimental syntax extension for options. The `with`
// keyword enables annotations to be inlined and co-located with a type,
// but comes at the cost of portability between TypeScript.
//
// IMPORTANT NOTE!!:
//
// The `with` keyword is considered experimental and could be replaced  
// with a formal TypeScript annotation or refinement syntax in the future.
// Future revisions of TypeBox will opt to break the `with` syntax if it
// ever comes into conflict with the TypeScript language. Users are advised to 
// use the wrapping `Options<Type, Json>` generic call if in doubt.
// 
// ----------------------------------------------------------------------------
const VectorC = Type.Script(`{
  x: number with { minimum: 0, maximum: 1 }
  y: number with { minimum: 0, maximum: 1 }
} with { additionalProperties: false }`)
```

The above `VectorA`, `VectorB`, and `VectorC` types all produce the following JSON Schema:

```typescript
const Vector = {
  type: 'object',
  required: ['x', 'y'],
  properties: {
    x: { type: 'number', minimum: 0, maximum: 1 },
    y: { type: 'number', minimum: 0, maximum: 1 }
  },
  additionalProperties: false
}
```

## Options

The Script function is a member of the `Type.*` family of types and will accept Options via the last argument. 

```typescript
// ----------------------------------------------------------------------------
// Without Script 
// ----------------------------------------------------------------------------
const A = Type.Number({                  // type A = {
  minimum: 0                             //   type: 'number',
  maximum: 1                             //   minimum: 0,
})                                       //   maximum: 1
                                         // }

// ----------------------------------------------------------------------------
// With Script 
// ----------------------------------------------------------------------------
const B = Type.Script('number', {        // type B = {
  minimum: 0                             //   type: 'number',
  maximum: 1                             //   minimum: 0,
})                                       //   maximum: 1
                                         // }
```      