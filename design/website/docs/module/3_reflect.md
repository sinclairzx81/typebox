# Module.Reflect

Module types are designed to be analogous to types in strongly typed languages like C#, where a type carries both static and runtime information. For module types, runtime type information is held in the JSON Schema that was used to compile the module.

## Example

Given the following Vector type:

```typescript
const Output = Module.Build(Type.Script(`
  type Vector = {
    x: number
    y: number
    z: number
  } with {
    additionalProperties: false
  }
`))
```

We can read structural information using a type's Schema() function.

```typescript
import { Vector } from './geometry.ts'

console.log(Vector.Schema())                       // prints: {
                                                   //   type: 'object',
                                                   //   required: ['x', 'y', 'z'],
                                                   //   properties: {
                                                   //     x: { type: 'number' },
                                                   //     y: { type: 'number' },
                                                   //     z: { type: 'number' }
                                                   //   },
                                                   //   additionalProperties: false
                                                   // }
```