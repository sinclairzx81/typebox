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