# Standard Schema V1

This example is an adapter to the Standard Schema V1 specification.

```typescript
import StandardSchema, { type StandardSchemaV1 } from './standard/standard.ts'
import Type from 'typebox'

const T = StandardSchema(Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}))

type T = StandardSchemaV1.InferInput<typeof T> // type T = {
                                               //   x: number,
                                               //   y: number,
                                               //   z: number
                                               // }

const R = T['~standard'].validate({            // const R: StandardSchemaV1.Result<{
  x: 1,                                        //   x: number;
  y: 2,                                        //   y: number;
  z: 3                                         //   z: number;
})                                             // }> | Promise<StandardSchemaV1.Result<{
                                               //   x: number;
                                               //   y: number;
                                               //   z: number;
                                               // }>>
```