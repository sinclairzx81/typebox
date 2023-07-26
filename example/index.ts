import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Optional } from '@sinclair/typebox'

import { Check } from '@sinclair/typebox/value/check'

const A = Value.Check(Type.String(), 'hello world')

const P = Type.Object({
  x: Type.Number(),
  y: Type.String(),
  z: Type.String(),
})
console.log(A)

// Modifiers
//  - Deprecate Modifier Symbol
//  - Add Readonly Symbol
//  - Add Optional Symbol
// TypeExtends:
//  - implemented StructuralRight()  - (done)
// deprecate Type.RegExp()
//  - Deprecated Type.RegEx()        - (done)
//  - Add Type.RegExp()              - (done)
// Array: contains, minContains, maxContains
//  - typecompiler                   - (done)
//  - value                          - (done)
//  - error                          - (done)
//  - create                         - (done)
//  - tests                          - (done)
// Iterators: Type.Iterator & Type.IteratorAsync
//  - typecompiler                   - (done)
//  - value                          - (done)
//  - error                          - (done)
//  - create                         - (done)
//  - cast                           - (done)
//  - tests                          - (done - not create)
// Value
//  - remove namespaces              - (done)
//  - retain value pointer           - (done)
//  - add common value guard utility - (done)
//  - figure out what to do with non-nomimal-object

// 0.29.0
// ┌──────────────────────┬────────────┬────────────┬─────────────┐
// │       (index)        │  Compiled  │  Minified  │ Compression │
// ├──────────────────────┼────────────┼────────────┼─────────────┤
// │ typebox/compiler     │ '130.3 kb' │ ' 58.2 kb' │  '2.24 x'   │
// │ typebox/errors       │ '113.3 kb' │ ' 49.8 kb' │  '2.27 x'   │
// │ typebox/system       │ ' 78.8 kb' │ ' 32.2 kb' │  '2.45 x'   │
// │ typebox/value        │ '180.0 kb' │ ' 77.7 kb' │  '2.32 x'   │
// │ typebox              │ ' 77.7 kb' │ ' 31.7 kb' │  '2.45 x'   │
// └──────────────────────┴────────────┴────────────┴─────────────┘

// ┌──────────────────────┬────────────┬────────────┬─────────────┐
// │       (index)        │  Compiled  │  Minified  │ Compression │
// ├──────────────────────┼────────────┼────────────┼─────────────┤
// │ typebox/compiler     │ '130.3 kb' │ ' 59.0 kb' │  '2.21 x'   │
// │ typebox/errors       │ '112.0 kb' │ ' 50.1 kb' │  '2.24 x'   │
// │ typebox/system       │ ' 75.4 kb' │ ' 31.3 kb' │  '2.41 x'   │
// │ typebox/value        │ '181.7 kb' │ ' 79.2 kb' │  '2.29 x'   │
// │ typebox              │ ' 74.3 kb' │ ' 30.8 kb' │  '2.41 x'   │
// └──────────────────────┴────────────┴────────────┴─────────────┘

// ┌──────────────────────┬────────────┬────────────┬─────────────┐
// │       (index)        │  Compiled  │  Minified  │ Compression │
// ├──────────────────────┼────────────┼────────────┼─────────────┤
// │ typebox/compiler     │ '129.4 kb' │ ' 58.7 kb' │  '2.20 x'   │
// │ typebox/errors       │ '111.1 kb' │ ' 49.8 kb' │  '2.23 x'   │
// │ typebox/system       │ ' 75.4 kb' │ ' 31.3 kb' │  '2.41 x'   │
// │ typebox/value        │ '175.6 kb' │ ' 77.9 kb' │  '2.25 x'   │
// │ typebox              │ ' 74.3 kb' │ ' 30.8 kb' │  '2.41 x'   │
// └──────────────────────┴────────────┴────────────┴─────────────┘

// ┌──────────────────────┬────────────┬────────────┬─────────────┐
// │       (index)        │  Compiled  │  Minified  │ Compression │
// ├──────────────────────┼────────────┼────────────┼─────────────┤
// │ typebox/compiler     │ '129.4 kb' │ ' 58.7 kb' │  '2.20 x'   │
// │ typebox/errors       │ '111.1 kb' │ ' 49.8 kb' │  '2.23 x'   │
// │ typebox/system       │ ' 75.4 kb' │ ' 31.3 kb' │  '2.41 x'   │
// │ typebox/value        │ '175.5 kb' │ ' 77.7 kb' │  '2.26 x'   │
// │ typebox              │ ' 74.3 kb' │ ' 30.8 kb' │  '2.41 x'   │
// └──────────────────────┴────────────┴────────────┴─────────────┘

// ┌──────────────────────┬────────────┬────────────┬─────────────┐
// │       (index)        │  Compiled  │  Minified  │ Compression │
// ├──────────────────────┼────────────┼────────────┼─────────────┤
// │ typebox/compiler     │ '130.3 kb' │ ' 59.1 kb' │  '2.20 x'   │
// │ typebox/errors       │ '112.0 kb' │ ' 50.2 kb' │  '2.23 x'   │
// │ typebox/system       │ ' 75.4 kb' │ ' 31.3 kb' │  '2.41 x'   │
// │ typebox/value        │ '175.2 kb' │ ' 77.0 kb' │  '2.28 x'   │
// │ typebox              │ ' 74.3 kb' │ ' 30.8 kb' │  '2.41 x'   │
// └──────────────────────┴────────────┴────────────┴─────────────┘
