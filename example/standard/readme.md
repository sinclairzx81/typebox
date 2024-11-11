### Standard Schema

This example is a reference implementation of [Standard Schema](https://github.com/standard-schema/standard-schema) for TypeBox.

### Overview

This example provides a reference implementation for the Standard Schema specification. Despite the name, this specification is NOT focused on schematics. Rather, it defines a set of common TypeScript interfaces that libraries are expected to implement to be considered "Standard" for framework integration, as defined by the specification's authors.

The TypeBox project has some concerns about the Standard Schema specification, particularly regarding its avoidance to separate concerns between schematics and the logic used to validate those schematics. TypeBox does respect such separation for direct interoperability with industry standard validators as well as to allow intermediate processing of types (Compile). Additionally, augmenting schematics in the way proposed by Standard Schema would render Json Schema invalidated (which is a general concern for interoperability with Json Schema validation infrastructure, such as Ajv).

The Standard Schema specification is currently in its RFC stage. TypeBox advocates for renaming the specification to better reflect its purpose, such as "Common Interface for Type Integration." Additionally, the requirement for type libraries to adopt a common interface for integration warrants review. The reference project link provided below demonstrates an alternative approach that would enable integration of all type libraries (including those not immediately compatible with Standard Schema) to be integrated into frameworks (such as tRPC) without modification to a library's core structure.

[Type Adapters](https://github.com/sinclairzx81/type-adapters)

### Example

The Standard Schema function will augment TypeBox's Json Schema with runtime validation methods. These methods are assigned to the sub property `~standard`. Once a type is augmented, it should no longer be considered valid Json Schema.

```typescript
import { Type } from '@sinclair/typebox'
import { StandardSchema } from './standard'

// The Standard Schema function will augment a TypeBox type with runtime validation 
// logic to validate / parse a value (as mandated by the Standard Schema interfaces). 
// Calling this function will render the json-schema schematics invalidated, specifically
// the non-standard keyword `~standard` which ideally should be expressed as a non
// serializable symbol (Ajv strict)

const A = StandardSchema(Type.Object({     // const A = {
  x: Type.Number(),                        //   '~standard': { version: 1, vendor: 'TypeBox', validate: [Function: validate] },
  y: Type.Number(),                        //   type: 'object',
  z: Type.Number(),                        //   properties: {
}))                                        //     x: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' },
                                           //     y: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' },
                                           //     z: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' }
                                           //   },
                                           //   required: [ 'x', 'y', 'z' ],
                                           //   [Symbol(TypeBox.Kind)]: 'Object'
                                           // }

const R = A['~standard'].validate({ x: 1, y: 2, z: 3 }) // const R = { value: { x: 1, y: 2, z: 3 }, issues: [] }
```

### Ajv Strict

Applying Standard Schema to a TypeBox types renders them unusable in Ajv. The issue is due to the `~standard` property being un-assignable as a keyword (due to the leading `~`)

```typescript
import Ajv from 'ajv'

const ajv = new Ajv().addKeyword('~standard') // cannot be defined as keyword.

const A = StandardSchema(Type.Object({     // const A = {
  x: Type.Number(),                        //   '~standard': { version: 1, vendor: 'TypeBox', validate: [Function: validate] },
  y: Type.Number(),                        //   type: 'object',
  z: Type.Number(),                        //   properties: {
}))                                        //     x: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' },
                                           //     y: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' },
                                           //     z: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' }
                                           //   },
                                           //   required: [ 'x', 'y', 'z' ],
                                           //   [Symbol(TypeBox.Kind)]: 'Object'
                                           // }


ajv.validate(A, { x: 1, y: 2, z: 3 }) // Error: Keyword ~standard has invalid name
```
