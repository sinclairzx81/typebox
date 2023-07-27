import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Optional, TNumber } from '@sinclair/typebox'

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
//    - rename is-plain-object
// Transform
//  - Going to move this into examples as I'm not
//    comfortable going out with this functionality.
//    The problem is stacked transforms can't be
//    validated, and generally this thing needs more
//    design before going out on a release.

import { Transform, Encode, Decode } from './transform'

// Applies codec functions to a type
const Timestamp = Transform(Type.Number(), {
  decode: (value) => new Date(value),
  encode: (value) => value.getTime(),
})
// Transform type can be nested within objects
const N = Type.Object({
  timestamp: Timestamp,
})

// Decodes as { timestamp: Date }
const D = Decode(N, { timestamp: Date.now() })

// Encodes as { timestamp: number }
const E = Encode(N, D)
