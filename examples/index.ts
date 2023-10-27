import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, KeyResolver } from '@sinclair/typebox'
import { Run } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

const T = Type.Intersect([Type.Number(), Type.Number()])

const R = Value.Strict(T, 1)

console.log(R)

// const C = TypeCompiler.Compile(Loose)

// const A = Value.Clone(new Map())

// console.log(A)
