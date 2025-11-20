# Compile

High Performance Runtime Validation

## Overview

The Compile module is a high-performance JIT compiler that transforms types into efficient runtime validators. The compiler is optimized for both fast compilation and validation.

```typescript
import { Compile } from 'typebox/compile' 
```

### Example

The following uses the compiler to Compile and Parse a value. 

```typescript
const C = Compile(Type.Object({                     // const C: Validator<{}, TObject<{
  x: Type.Number(),                                 //   x: TNumber,
  y: Type.Number(),                                 //   y: TNumber,
  z: Type.Number()                                  //   z: TNumber
}))                                                 // }>>

const A = C.Parse({                                 // const A: {
  x: 0,                                             //   x: number,
  y: 1,                                             //   y: number,
  z: 0                                              //   z: number
})                                                  // } = ...
```
