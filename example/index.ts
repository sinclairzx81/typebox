import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

// Modifiers
//  - Deprecate Modifier Symbol
//  - Add Readonly Symbol
//  - Add Optional Symbol
// TypeExtends:
//  - implemented StructuralRight()
// deprecate Type.RegExp()
//  - Deprecated Type.RegEx()
//  - Add Type.RegExp()
// Array: contains, minContains, maxContains
//  - typecompiler - (done)
//  - value        - (done)
//  - error        - (done)
//  - create       - (done)
//  - tests        - (done)
// Iterators: Type.Iterator & Type.IteratorAsync
//  - typecompiler - (done)
//  - value        - (done)
//  - error        - (done)
//  - create       - (done)
//  - cast         - (done)
//  - tests        - (done - not create)

// ┌──────────────────────┬────────────┬────────────┬─────────────┐
// │       (index)        │  Compiled  │  Minified  │ Compression │
// ├──────────────────────┼────────────┼────────────┼─────────────┤
// │ typebox/compiler     │ '130.3 kb' │ ' 59.0 kb' │  '2.21 x'   │
// │ typebox/errors       │ '112.0 kb' │ ' 50.1 kb' │  '2.24 x'   │
// │ typebox/system       │ ' 75.4 kb' │ ' 31.3 kb' │  '2.41 x'   │
// │ typebox/value        │ '181.7 kb' │ ' 79.2 kb' │  '2.29 x'   │
// │ typebox              │ ' 74.3 kb' │ ' 30.8 kb' │  '2.41 x'   │
// └──────────────────────┴────────────┴────────────┴─────────────┘
