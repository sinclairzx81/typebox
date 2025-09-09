# Value

Functions to Process JavaScript Values

## Overview

The Value module provides functions to Check and Parse JavaScript values. This module also includes functions that perform structural operations values such as Clone, Repair, Encode, Decode, Diff, Patch and Hash. This module has support for Json Schema and Standard Schema.

The Value module is available via optional import.

```typescript
import Value from 'typebox/value'
```

### Example

The following uses the Value module to Check and Parse a value. 

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

// Check

const A = Value.Check(T, {                          // const A: boolean = true
  x: 1,                                            
  y: 2,
  z: 3
})

// Parse

const B = Value.Parse(T, {                          // const B: {
  x: 1,                                             //   x: number,
  y: 2,                                             //   y: number,
  z: 3                                              //   z: number
})                                                  // } = ...
```