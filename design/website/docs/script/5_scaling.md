# Scaling

This page details type scaling behaviours for Script

## Wide vs Deep

Script is designed to support wide data structures. These structures leverage TypeScript tail call optimizations to prevent +1 depth per sequence token or element. 

```typescript
const T = Type.Script(`[   // 1 x depth
  0, 1, 2, 3, 4, 5, 6, 7,  // 128 x elements  
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7,
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
  0, 1, 2, 3, 4, 5, 6, 7, 
]`)

```

However deep nested structures will hit TypeScript instantiation depth limits very quickly.

```typescript
const T = Type.Script(`{          // depth + 1
  a: {                            // depth + 2
    b: {                          // depth + 3
      c: {                        // depth + 4
        d: {                      // instantiation too deep
          e: 1
        }
      }
    }
  }  
}`)
```

If you need to represent deep structures with Script consider refactoring in the following way.

```typescript
const D = Type.Script(`{ e: 1 }`)                   // depth + 1
const C = Type.Script({ D }, `{ d: D }`)            // depth + 1
const B = Type.Script({ C }, `{ c: C }`)            // depth + 1
const A = Type.Script({ B }, `{ b: B }`)            // depth + 1

const T = Type.Script({ A }, `{ a: A }`)            // ok

```

## Excessive Types

Script supports static inference for moderately sized types, but for excessive types, you will likely need to bail out of inference. This can be done by using a `as never` assertion. The Script will parse the type at runtime, but type inference will be lost. 

> ⚠️ For large types it is recommended to use the standard Type API.

```typescript
const LargeType: TSchema = Type.Script(`{
  x0: string,
  x1: string,
  x2: string,
  x3: string,
  // ... excessive properties
  x999999: string
}
` as never)  // bail out!!
```

