import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, KeyResolver, TObject } from '@sinclair/typebox'
import { Run } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests - Done

const A = Type.Union([
  Type.Number({ default: 1 }),
  Type.String({ default: 'hello' })
])

const X = Value.Default(A, undefined) // should pick the first?

console.log(X)





