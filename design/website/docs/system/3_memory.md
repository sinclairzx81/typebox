# Memory

The Memory namespace is used to allocate schematics with enumerable and non-enumerable properties as well as track of allocations made by the type system. 

## Metrics

The Memory namespace includes a Metrics property that tracks allocations created within the type system. You can use this property to inspect memory usage, debug, or gain insights into the allocations required during instantiation.

```typescript
const Reverse = Type.Script(`<T, Result extends unknown[] = []> = (
  T extends [infer L, ...infer R] 
    ? Reverse<R, [L, ...Result]>
    : Result
)`)

const Result = Type.Script({ Reverse }, `Reverse<[
  1, 2, 3, 4, 5, 6, 7, 8
]>`)                                          // TTuple<[
                                              //   TLiteral<8>,
                                              //   TLiteral<7>,
                                              //   ...
                                              //   TLiteral<0>
                                              // ]>

// --------------------------------------------------------
// Debug
// --------------------------------------------------------

import { Memory } from 'typebox/system'

console.log(Memory.Metrics)                   // { 
                                              //   assign: 42, 
                                              //   create: 459, 
                                              //   clone: 108, 
                                              //   discard: 97, 
                                              //   update: 11 
                                              // }
```