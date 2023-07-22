# Prototype Types

The following are a set of candidate types that may introduced into TypeBox in future.

## Const

This type will wrap all interior properties as `readonly` leaving the outer type unwrapped.

```typescript
import { Const } from './prototype'

const T = Const(Type.Object({
  x: Type.Number()
}))

type T = Static<typeof T>                           // type T = {
                                                    //   readonly x: number
                                                    // }
```
## UnionEnum

Creates an `enum` union string schema representation.

```typescript
import { UnionEnum } from './prototype'


const T = UnionEnum(['A', 'B', 'C'])                // const T = {
                                                    //   enum: ['A', 'B', 'C']
                                                    // }

type T = Static<typeof T>                           // type T = 'A' | 'B' | 'C'

```
## UnionOneOf

Creates a `oneOf` union representation.


```typescript
import { UnionOneOf } from './prototype'


const T = UnionOneOf([                              // const T = {
  Type.Literal('A'),                                //   oneOf: [
  Type.Literal('B'),                                //     { const: 'A' },
  Type.Literal('C')                                 //     { const: 'B' },
])                                                  //     { const: 'C' },
                                                    //   ]
                                                    // }

type T = Static<typeof T>                           // type T = 'A' | 'B' | 'C'

```