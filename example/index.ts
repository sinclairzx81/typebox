import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { SetIntersectMany, Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const A = SetIntersectMany([
  [1, 2],
  [1, 2],
] as const)
console.log(A)
