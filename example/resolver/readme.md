# ReferenceResolver

Automatic `$ref` resolution for Ajv compilation

## Overview

When compiling `$ref` schemas with Ajv, it can sometimes be difficult to ensure that all referenced schemas are configured via `.addSchema()` before compilation. TypeBox can provide a partial solution to this by allowing direct and indirect referenced schemas to be resolve through TypeBox's internal `ReferenceRegistry`. 

## Problem

Below we have two types `T` and `R` with `R` referencing `T`. When wanting to compile `R` we must carry around `T` and ensure it's configured. Failing to do this results in a "schema with $id not found" error.

```typescript
import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'

const T = Type.Object({                               // This is the target type T
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
}, { $id: 'T' })

const R = Type.Ref(T)                                // This is the reference type R

// ---

const ajv = new Ajv()

ajv.addSchema([T])                                   // Before we can compile for R, we need to configure Ajv 
                                                     // for T. This can be awkward as the intent is to treat
                                                     // R as a standalone type, but we need to carry around 
                                                     // additional type(s) just to compile for it.

const C = ajv.compile(R)

const Ok = C({ x: 1, y: 2, z: 3 })                   // const Ok = true
```

## Solution

The following shows `$ref` resolution using the `TypeResolver` included with this example. Note that `T` type is not required for the compilation of `R` as it can be auto resolved through the TypeBox `ReferenceRegistry`.

```typescript
import { ReferenceResolver } from './resolver'

const T = Type.Object({                               // This is the target type T
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
}, { $id: 'T' })

const R = Type.Ref(T)                                 // This is the reference type R

// ---

const ajv = new Ajv()

ajv.addSchema([...ReferenceResolver.Resolve(R)])       // We only need R to gather all direct and indirect references.

const C = ajv.compile(R)

const Ok = C({ x: 1, y: 2, z: 3 })                   // const Ok = true
```