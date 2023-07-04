# Experimental Types

These examples are a set of experiemental candidate types that may introduced into TypeBox in future.

## ReadonlyObject

Maps an object properties as `readonly`.

```typescript
import { ReadonlyObject } from './experimental'

const T = ReadonlyObject(Type.Object({
  x: Type.Number()
}))

type T = Static<typeof T>                           // type T = {
                                                    //   readonly x: number
                                                    // }
```
## UnionEnum

Creates an `enum` union string schema representation.

```typescript
import { UnionEnum } from './experimental'


const T = UnionEnum(['A', 'B', 'C'])                // const T = {
                                                    //   enum: ['A', 'B', 'C']
                                                    // }

type T = Static<typeof T>                           // type T = 'A' | 'B' | 'C'

```
## UnionOneOf

Creates a `oneOf` union representation.


```typescript
import { UnionOneOf } from './experimental'


const T = UnionOneOf([                              // const T = {
  Type.Literal('A'),                                //   oneOf: [
  Type.Literal('B'),                                //     { const: 'A' },
  Type.Literal('C')                                 //     { const: 'B' },
])                                                  //     { const: 'C' },
                                                    //   ]
                                                    // }

type T = Static<typeof T>                           // type T = 'A' | 'B' | 'C'

```