import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, KeyResolver, TObject } from '@sinclair/typebox'
import { Run } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests
const T = Type.Tuple([Type.Number(), Type.Number()])
const R = Value.Clean(T, [1, 2, 3])
console.log(R)
