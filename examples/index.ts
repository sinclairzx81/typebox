import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, KeyResolver, TObject } from '@sinclair/typebox'
import { Run } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

const X = Type.Object({ x: Type.Number() })
const Y = Type.Object({ y: Type.Number() })
const T = Type.Union([X, Y])
const R = Value.Clean(T, { u: null, x: 1 })

console.log(R)
