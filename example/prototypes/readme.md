# TypeBox Prototypes

TypeBox prototypes are a set of types that are either under consideration for inclusion into the library, or have been requested by users but cannot be added to the library either due to complexity, using schematics that fall outside the supported TypeBox or should be expressed by users via advanced type composition.


## PartialDeep

Maps the given schema as deep partial, making all properties and sub properties optional. This type is asked for on occation, but as there is no TypeScript equivalent and because this type is typically handled through end user type mapping, this type is left out of TypeBox.

```typescript
import { PartialDeep } from './prototypes'

const T = Type.Object({ 
  x: Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }),
  y: Type.Object({
    x: Type.Number(),
    y: Type.Number()
  })
})

const P = PartialDeep(T)

type P = Static<typeof P>                           // type P = {
                                                    //   x?: {
                                                    //     x?: number,
                                                    //     y?: number
                                                    //   },
                                                    //   y?: {
                                                    //     x?: number,
                                                    //     y?: number
                                                    //   },
                                                    // }
```

## UnionEnum

Creates an `enum` union string schema representation. This type is often requested by OpenAPI users, particularily for documentation presentation. As TypeBox standardizes on `anyOf` for all unions, this type is generally at odds with TypeBox's internal representation. Some considerations for internally remapping this type into a `anyOf` through composition have been considered (and would be feasible), but as TypeScript doesn't have multiple representations for unions, neither should TypeBox, making this type an unlikely candidate.

```typescript
import { UnionEnum } from './prototypes'


const T = UnionEnum(['A', 'B', 'C'])                // const T = {
                                                    //   enum: ['A', 'B', 'C']
                                                    // }

type T = Static<typeof T>                           // type T = 'A' | 'B' | 'C'

```
## UnionOneOf

Creates a `oneOf` union representation. This type is often requested by users looking for discriminated union support (which is not formally supported by JSON Schema). TypeBox omits this type as `oneOf` has the potential to create illogical schematics where values match more than one sub schema (making type inference extremely difficult). TypeBox preferences users explicitly narrowing on a overlapping union post type check, making `anyOf` the ideal representation, leaving the `oneOf` type an unlikely candidate for inclusion in the library.


```typescript
import { UnionOneOf } from './prototypes'


const T = UnionOneOf([                              // const T = {
  Type.Literal('A'),                                //   oneOf: [
  Type.Literal('B'),                                //     { const: 'A' },
  Type.Literal('C')                                 //     { const: 'B' },
])                                                  //     { const: 'C' },
                                                    //   ]
                                                    // }

type T = Static<typeof T>                           // type T = 'A' | 'B' | 'C'

```

## Options

By default, TypeBox does not represent arbituary options as generics aware properties. However, there are cases where having options observable to the type system can be useful, for example conditionally mapping schematics based on custom metadata. The Options function makes user defined options generics aware.

```typescript
import { Options } from './prototypes'

const A = Options(Type.String(), { foo: 1 })             // Options<TString, { foo: number }>

type A = typeof A extends { foo: number } ? true : false // true: foo property is observable to the type system
```

## Recursive Map
The Recursive Map type enables deep structural remapping of a type and it's internal constituents. This type accepts a TSchema type and a mapping type function (expressed via HKT). The HKT is applied when traversing the type and it's interior. The mapping HKT can apply conditional tests to each visited type to remap into a new form. The following augments a schematic via Options, and conditionally remaps any schema with an default annotation to make it optional. 
```typescript
import { Type, TOptional, Static, TSchema } from '@sinclair/typebox'

import { TRecursiveMap, TMappingType, Options } from './prototypes'

// ------------------------------------------------------------------
// StaticDefault
// ------------------------------------------------------------------
export interface StaticDefaultMapping extends TMappingType { 
  output: (
    this['input'] extends TSchema                        // if input schematic contains an default 
      ? this['input'] extends { default: unknown }       // annotation, remap it to be optional, 
        ? TOptional<this['input']>                       // otherwise just return the schema as is.
        : this['input']
      : this['input']
  )
}
export type StaticDefault<Type extends TSchema> = (
  Static<TRecursiveMap<Type, StaticDefaultMapping>>
)

// ------------------------------------------------------------------
// Usage
// ------------------------------------------------------------------

const T = Type.Object({
  x: Options(Type.String(), { default: 'hello' }),
  y: Type.String()
})

type T = StaticDefault<typeof T>   // { x?: string, y: string }
type S = Static<typeof T>          // { x: string, y: string }