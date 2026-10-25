# Module.Build

The Module.Build(...) function accepts any valid JSON Schema and compiles it into a standalone runtime validator. TypeBox supports two output module formats, Namespace and Type, where the format is determined by the structure of the schema.

## Namespace

A namespace module is generated if the schema contains an isolated $defs with no other keywords.

```typescript
import Module from 'typebox/module'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------

const Output = Module.Build({ 
  $defs: {
    A: { type: 'number' },
    B: { type: 'string' },
    C: { type: 'boolean' }
  }
})

SaveToDisk('./foo.ts', Output)

// ------------------------------------------------------------------
// Import
// ------------------------------------------------------------------

import Foo from './foo.ts'

const validA  = Foo.A.Check(1)               // const validA = true
const validB  = Foo.B.Check('hello')         // const validB = true
const validC  = Foo.C.Check(true)            // const validC = true

const resultA = Foo.A.Parse(42)              // const resultA = true
const resultB = Foo.B.Parse('hello')         // const resultB = true
const resultC = Foo.C.Parse(true)            // const resultC = true
```

Type modules can also be passed to Module.Build(...):

```typescript
const Output = Module.Build(Type.Module({
  A: Type.Number(),
  B: Type.String(),
  C: Type.Boolean()
}))
```

## Type

The following builds an anonymous type.

```typescript
import Module from 'typebox/module'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------

const Output = Module.Build({ type: 'string' })

SaveToDisk('./foo.ts', Output)

// ------------------------------------------------------------------
// Import
// ------------------------------------------------------------------

import Foo from './foo.ts'

const valid = Foo.Check('hello')                   // const valid = true

const result = Foo.Parse('hello')                  // const result = 'hello'
```

