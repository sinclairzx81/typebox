# Standard Schema V1

This is a reference adapter for the Standard Schema V1 specification. The adapter enables Json Schema and TypeBox schematics to be mapped into a StandardSchemaV1 interface.

### Json Schema

Json Schema can be passed to the StandardSchemaV1 function.

```typescript
import StandardSchemaV1 from './standard/standard.ts'

const T = StandardSchemaV1({
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
})

type T = StandardSchemaV1.InferInput<typeof T>      // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }

const R = T['~standard'].validate(null)             // const R: StandardSchemaV1.Result<{
                                                    //   x: number;
                                                    //   y: number;
                                                    //   z: number;
                                                    // }> | Promise<StandardSchemaV1.Result<{
                                                    //   x: number;
                                                    //   y: number;
                                                    //   z: number;
                                                    // }>>
```

### TypeBox

TypeBox types can also be passed.

```typescript
import StandardSchemaV1 from './standard/standard.ts'
import Type from 'typebox'

const T = StandardSchemaV1(Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}))

type T = StandardSchemaV1.InferInput<typeof T>      // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }

const R = T['~standard'].validate({                 // const R: StandardSchemaV1.Result<{
  x: 1,                                             //   x: number;
  y: 2,                                             //   y: number;
  z: 3                                              //   z: number;
})                                                  // }> | Promise<StandardSchemaV1.Result<{
                                                    //   x: number;
                                                    //   y: number;
                                                    //   z: number;
                                                    // }>>
```

