import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const A = Value.Clean(
  Type.Object({
    x: Type.Number(),
    y: Type.Number(),
  }),
  { x: 1, z: 3 },
)

console.log(A)
