### Standard Schema

Reference implementation of [Standard Schema](https://github.com/standard-schema/standard-schema) for TypeBox.

### Example

The following example augments a TypeBox schema with the required `~standard` interface. The `~standard` interface is applied via non-enumerable configuration enabling the schematics to continue to be used with strict compliant validators such as Ajv that would otherwise reject the non-standard `~standard` keyword.

```typescript
import { StandardSchema } from './standard'
import { Type } from '@sinclair/typebox'

const T = StandardSchema(Type.Object({     // const A = {
  x: Type.Number(),                        //   (non-enumerable) '~standard': { 
  y: Type.Number(),                        //      version: 1, 
  z: Type.Number(),                        //      vendor: 'TypeBox', 
}))                                        //      validate: [Function: validate] 
                                           //   },
                                           //   type: 'object',
                                           //   properties: {
                                           //     x: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' },
                                           //     y: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' },
                                           //     z: { type: 'number', [Symbol(TypeBox.Kind)]: 'Number' }
                                           //   },
                                           //   required: [ 'x', 'y', 'z' ],
                                           //   [Symbol(TypeBox.Kind)]: 'Object'
                                           // }

const R = T['~standard'].validate({ x: 1, y: 2, z: 3 }) // const R = { 
                                                        //   value: { x: 1, y: 2, z: 3 }, 
                                                        //   issues: [] 
                                                        // }
```