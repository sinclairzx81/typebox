# Value

Check and Parse JavaScript Values

## Overview

The Value module provides functions that perform typed operations on JavaScript values. It includes functions such as Check, Parse, Clone, Encode, Decode and as well as advanced functions to perform structural Diff and Patch on dynamic JavaScript values.

```typescript
import Value from 'typebox/value'
```

### Example

The following uses the Value module to Parse a value. 

```typescript
const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const A = Value.Parse(T, {                          // const A: {
  x: 1,                                             //   x: number,
  y: 0,                                             //   y: number,
  z: 0                                              //   z: number
})                                                  // } = ...
```