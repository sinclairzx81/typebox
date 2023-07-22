import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Optional } from '@sinclair/typebox'

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

import { Check } from '@sinclair/typebox/value/check'
import { Cast } from '@sinclair/typebox/value/cast'
import { Convert } from '@sinclair/typebox/value/convert'
